import type { GenerateParams, GenerateTextResult, LanguageModel } from "../types";

// generateText用のパラメータ（GenerateParamsにmodelを追加）
type GenerateTextParams = GenerateParams & {
    model: LanguageModel;
};

// 引数として受け取ったmodelのdoGenerateメソッドを呼び出すだけ。複雑なロジック(SDK 呼び出し、エラーハンドリング、レスポンス変換)はすべてプロバイダー 層に隠蔽。
export async function generateText(
    params: GenerateTextParams
): Promise<GenerateTextResult> {
    return await params.model.doGenerate({
        messages: params.messages,
        tools: params.tools,
        temperature: params.temperature,
        maxTokens: params.maxTokens,
        signal: params.signal,
    });
}
