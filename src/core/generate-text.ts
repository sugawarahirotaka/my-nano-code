import type { GenerateParams, GenerateTextResult, LanguageModel } from "../types";

// generateText用のパラメータ（GenerateParamsにmodelを追加）
type GenerateTextParams = GenerateParams & {
    model: LanguageModel;
};

// 引数として受け取ったmodelのdoGenerateメソッドを呼び出すだけ。複雑なロジック(SDK 呼び出し、エラーハンドリング、レスポンス変換)はすべてプロバイダー 層に隠蔽。
// これは、 プロバイダー作成、モデル生成、テキスト生成という 3 段階の流れの内、最後で用いる。modelはLanguageModel型ゆえ、プロバイダを切り替えても、generateTextの呼び出しコードは変更不要
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
