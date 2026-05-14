// LLMが理解するツール定義（JSONスキーマ + 実行関数）
export type Tool = {
    name: string;
    description: string;
    parameters: Record<string, unknown>; //JSON Schema相当（型チェックは実行時）
    execute: (args: Record<string, unknown>) => Promise<string>;
};

// ツール呼び出し(LLMからの応答)
export type ToolCall = {
    toolCallId: string;
    name: string;
    args: Record<string, unknown>;
};

// ツール実行結果の型（会話履歴に追加する）
export type ToolResult = {
    toolCallId: string;
    result: string;
};

// Message型：会話の最小単位 |は「または」の意味で、ユニオン型と言う。toolのnameフィールドは、GeminiAPIが実際の関数名を要求するため、必要。
export type Message =
    | { role: 'user' | 'system'; content: string }
    | { role: 'assistant'; content: string; toolCalls?: ToolCall[] }
    | { role: 'tool'; toolCallId: string; name: string; content: string };


// Usage型：トークン使用量のメタデータ（プロバイダによっては欠損する場合あり）
export type Usage = {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
};

// GenerateTextResult型：統一された出力形式
export type GenerateTextResult = {
    text: string;
    finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls' | 'error';
    toolCalls?: ToolCall[]; // LLMがツール呼び出しを要求した場合
    usage?: Usage;
};

// generateTextメソッドに渡すパラメータ
export type GenerateParams = {
    messages: Message[];
    tools?: Tool[]; //利用可能なツールの配列
    temperature?: number;
    maxTokens?: number; //省略時は、プロバイダのデフォを使用
    signal?: AbortSignal; //タイムアウトやキャンセル用
};

// 言語モデルのインタフェース（オブジェクトが持つべき形だけ定義するもの。今回は関数をメソッドとしてもつオブジェクトである。）
export interface LanguageModel {
    doGenerate(params: GenerateParams): Promise<GenerateTextResult>;
};

// プロバイダ関数の型（2段階Factoryモデルのうち、2段階目のモデル指定）
export type Provider = (modelId: string) => LanguageModel;

// LLM APIエラーの統一型
export class LLMApiError extends Error {
    constructor(
        //TypeScript のコンストラクタ引数で public をつけると、その引数がそのままクラスのプロパティになる
        public status: number, //HTTPステータスコード
        public provider: string,
        public code?: string, //エラーコード
        message?: string, //これは、コンストラクタ内でのみ使うから、public使わない（Error側が既に持っている標準プロパティ）
        public raw?: unknown
    ) {
        super(message || `LLM API Error: ${provider} returned ${status}`);
        this.name = 'LLMApiError';
    }
}
