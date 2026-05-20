import * as fs from 'fs/promises';
import * as path from 'path';

const WORKSPACE_ROOT = path.resolve(process.cwd(), './workspace');

async function writeFileExecute(args: {
    path: string;
    oldText: string; //変更前のテキスト（必須）
    newText: string; //変更後のテキスト
}): Promise<string> {
    // ステップ1：相対パス→絶対パス
    const absolutePath = path.resolve(WORKSPACE_ROOT, args.path);

    // ステップ2：ワークスペース内かチェック（ディレクトリトラバーサルの防止）
    const allowedPrefix = WORKSPACE_ROOT + path.sep;
    if (!absolutePath.startsWith(allowedPrefix) && absolutePath !== WORKSPACE_ROOT) {
        throw new Error(`アクセス拒否: ${args.path}はワークスペース外です`);
    }

    // ステップ3：置換前のファイルを読み込む(既存ファイルがあることを前提とする)
    const content = await fs.readFile(absolutePath, 'utf-8');

    // ステップ4：曖昧性チェック（変更対象が一意に特定できるか確認）　エラーを自然言語で書いた上に、対処法も含めることで、LLMの次の行動判断に繋げる。
    const matches = content.split(args.oldText).length - 1;
    if (matches === 0) {
        const preview = args.oldText.length > 50
            ? `${args.oldText.slice(0, 50)}...}`
            : args.oldText;
        throw new Error(`変更対象が見つかりません: ${preview}`);
    }
    if (matches > 1) {
        throw new Error(`複数の候補が見つかりました(${matches}箇所)。より具体的な範囲を指定してください`);
    }

    // ステップ5：テキストを検索、置換してファイルに書き込む
    const newContent = content.replace(args.oldText, args.newText);
    await fs.writeFile(absolutePath, newContent, 'utf-8');

    return `ファイルを編集しました: ${args.oldText.slice(0, 30)}... → ${args.newText.slice(0, 30)}... (${args.path})`;
}

export const editFile = {
    name: 'editFile',
    description: 'ファイルの一部を編集する。oldTextで指定した箇所をnewTextに置き換える。oldTextが複数見つかる場合はエラーを返すため、一意に特定できる範囲を指定すること。ファイル全体を読み書きするよりトークン消費が少ない。',
    parameters: {
        type: 'object',
        properties: {
            path: {
                type: "string",
                description: "編集するファイルのパス"
            },
            oldText: {
                type: "string",
                description: "変更前のテキスト（一意に特定できる範囲を指定）"
            },
            newText: {
                type: "string",
                description: "変更後のテキスト"
            }
        },
        required: ['path', 'oldText', 'newText']
    },
    execute: writeFileExecute
};
