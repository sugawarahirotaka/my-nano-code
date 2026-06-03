import { createOpenAI } from "./openai";
import { createAnthropic } from "./anthropic";
import { createGoogle } from "./google";
import type { LanguageModel } from "../types";

export function createModelFromEnv(): LanguageModel {
    // 1. 環境変数を読み取る
    const provider = process.env.LLM_PROVIDER;
    const modelName = process.env.LLM_MODEL;
    const apiKey = process.env.LLM_API_KEY;

    // 2. 必須の環境変数が未設定ならエラー
    if (!provider) {
        throw new Error("LLM_PROVIDER environment variable is not set.");
    }
    if (!modelName) {
        throw new Error("LLM_MODEL environment variable is not set.");
    }

    // 3. プロバイダーに応じてモデルを作成
    // LLM_API_KEYが設定されている場合、プロバイダ固有の環境変数に設定
    switch (provider.toLowerCase()) {
        case "openai":
            if (apiKey && !process.env.OPENAI_API_KEY) {
                process.env.OPENAI_API_KEY = apiKey;
            }
            // const openai = createOpenAI(); return openai(modelName);と同じ ;
            // createOpenAI関数はプロバイダのクライアントを返す関数を返すので、さらに(modelName)で呼び出してモデルを取得
            return createOpenAI()(modelName);
        case "anthropic":
            if (apiKey && !process.env.ANTHROPIC_API_KEY) {
                process.env.ANTHROPIC_API_KEY = apiKey;
            }
            return createAnthropic()(modelName);
        case "google":
            if (apiKey && !process.env.GEMINI_API_KEY) {
                process.env.GEMINI_API_KEY = apiKey;
            }
            return createGoogle()(modelName);
        default:
            throw new Error(`Unsupported provider: ${provider}　対応プロバイダ：OpenAI, Anthropic, Google`);
    }
}
