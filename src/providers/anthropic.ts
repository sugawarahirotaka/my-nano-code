import Anthropic from '@anthropic-ai/sdk';
import type { Tool as AnthropicTool } from '@anthropic-ai/sdk/resources/messages';
import type {
    GenerateParams,
    GenerateTextResult,
    LanguageModel,
    Provider,
    Message,
    ToolCall,
} from '../types'
import { LLMApiError } from "../types";

export function createAnthropic(config?: {
    apiKey?: string;
    maxRetries?: number;
}): Provider {
    // SDK初期化（認証はSDKが担当）
    const client = new Anthropic({
        apiKey: config?.apiKey, //省略時は環境変数を自動参照
        maxRetries: config?.maxRetries ?? 0, //nano-code-coreがリトライを制御
    });

    // Nano Code Message -> Anthropic形式へ変換
    function convertMessages(messages: Message[]) {
        return messages
            .filter((m) => m.role !== 'system')
            .map((m) => {
                // ツール実行結果は、userロールのtool_resultブロックとして送信される
                if (m.role === 'tool') {
                    return {
                        role: 'user' as const,
                        content: [
                            {
                                type: 'tool_result' as const,
                                tool_use_id: m.toolCallId,
                                content: m.content,
                            },
                        ],
                    };
                }
                // アシスタントのツール呼び出し
                if (m.role === 'assistant' && m.toolCalls) {
                    const content: any[] = [];
                    if (m.content) {
                        content.push({ type: 'text', text: m.content });
                    }
                    for (const tc of m.toolCalls) {
                        content.push({
                            type: 'tool_use',
                            id: tc.toolCallId,
                            name: tc.name,
                            input: tc.args,
                        });
                    }
                    return { role: 'assistant' as const, content };
                }
                return { role: m.role as 'user' | 'assistant', content: m.content };
            });
    }

    // finishReasonマッピング
    function mapFinishReason(stopReason: string | null
    ): GenerateTextResult['finishReason'] {
        switch (stopReason) {
            case 'end_turn': //
                return 'stop';
            case 'tool_use': //
                return 'tool_calls';
            case 'max_tokens':
                return 'length';
            default:
                return 'stop';
        }
    }

    return (modelId: string): LanguageModel => ({
        async doGenerate(params: GenerateParams): Promise<GenerateTextResult> {
            //systemメッセージを分離　（Anthoropic APIはmessages配列内にシステムメッセージを含められず、独立したsystemパラメータとして渡す必要がある）
            const systemMessages = params.messages.filter((m) => m.role === 'system');
            const system = systemMessages.map((m) => ({
                type: 'text' as const,
                text: m.content,
            }));
            //ツール定義をAnthropic形式に変換
            const tools = params.tools?.map((tool) => ({
                name: tool.name,
                description: tool.description,
                input_schema: tool.parameters as AnthropicTool.InputSchema,
            }));

            try {
                // 1. SDKで生成を実行
                const response = await client.messages.create(
                    {
                        model: modelId,
                        system, //独立したパラメータ
                        messages: convertMessages(params.messages), //systemを除外
                        max_tokens: params.maxTokens ?? 4096,
                        temperature: params.temperature,
                        ...(tools && tools.length > 0 && { tools }),
                    },
                    { signal: params.signal }
                );

                // 3. SDKの応答を統一型に変換
                const textBlocks = response.content.filter((b) => b.type === 'text');
                const text = textBlocks.map((b: any) => b.text).join('');

                const toolUseBlocks = response.content.filter(
                    (b) => b.type === 'tool_use'
                );
                const toolCalls: ToolCall[] | undefined =
                    toolUseBlocks.length > 0
                        ? toolUseBlocks.map((b) => ({
                            toolCallId: b.id,
                            name: b.name,
                            args: b.input as Record<string, unknown>,
                        }))
                        : undefined;

                return {
                    text,
                    finishReason: mapFinishReason(response.stop_reason),
                    toolCalls,
                    usage: {
                        promptTokens: response.usage.input_tokens,
                        completionTokens: response.usage.output_tokens,
                        totalTokens:
                            response.usage.input_tokens + response.usage.output_tokens,
                    },
                };
            } catch (error) {
                // 2. SDKの例外をLLMApiErrorに変換
                if (error instanceof Anthropic.APIError) {
                    throw new LLMApiError(
                        error.status,
                        'anthropic',
                        error.error?.type,
                        error.message,
                        error
                    );
                }
                throw error;
            }
        },
    });
}
