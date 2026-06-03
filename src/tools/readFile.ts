import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

// ワークスペースのルートディレクトリを定義
const WORKSPACE_ROOT = path.resolve(process.cwd(), './workspace');

// 読み込み可能なファイルサイズの上限（LLMのコンテキストウィンドウ保護）
const MAX_FILE_SIZE = 10 * 1024; // 100KB

async function readFileExecute(args: { path: string }): Promise<string> {
    // ステップ1：相対パス→絶対パス
    const absolutePath = path.resolve(WORKSPACE_ROOT, args.path);

    // ステップ2：ワークスペース内かチェック（ディレクトリトラバーサルの防止）../を用いたアクセスを防ぐ。単純なstartsWithでは、/project/workspace_privateのようなパスがすり抜けるため、末尾にセパレータを加えたものと比較する
    const allowedPrefix = WORKSPACE_ROOT + path.sep; //末尾にセパレータを加える
    if (!absolutePath.startsWith(allowedPrefix) && absolutePath !== WORKSPACE_ROOT) {
        throw new Error(`アクセス拒否: ${args.path}はワークスペース外です`);
    }

    // ステップ3：シンボリックリンクを解決して実パスがワークスペペース外でないかを検証
    //resolve: リンクや .. などをたどって、最終的な実体の場所を確定すること
    const realPath = await fs.realpath(absolutePath);
    if (!realPath.startsWith(allowedPrefix) && realPath !== WORKSPACE_ROOT) {
        throw new Error(`アクセス拒否: ${args.path}はシンボリックリンク経由でワークスペース外を参照しています`);
    }

    // ステップ4：ファイル種別とサイズのチェック LLMは自然言語はエラーメッセジから次の行動を判断できる
    try {
        const stat = await fs.stat(absolutePath);
        if (!stat.isFile()) { //デバイスファイルを除外
            throw new Error(`通常ファイルではありません: ${args.path}`);
        }
        if (stat.size > MAX_FILE_SIZE) {
            throw new Error(`ファイルサイズが大きすぎます: ${args.path} (${Math.round(stat.size / 1024)} KB)。100KB以下のファイルのみ読み込めます。`);
        }
    } catch (error) {
        const err = error as NodeJS.ErrnoException; //追記
        if (err.code === 'ENOENT') {
            throw new Error(`ファイルが見つかりません: ${args.path}`);
        }
        throw error;
    }

    // ステップ5：ファイル内容の読み込み
    const content = await fs.readFile(absolutePath, 'utf-8');
    return content;
}

// ツール定義オブジェクト　LLMはdescriptionを読んで、ツールを使うべきか判断するため、対象範囲・動作・エラー時の振る舞い・引数の形式を書くようにする
export const readFile = {
    name: 'readFile',
    description: 'ワークスペース内の指定されたパスのファイル内容を文字列として読み込む。ファイルが存在しない場合はエラーを返す。100KBを超える巨大ファイルは読み込めない(コンテキストウィンドウ保護のため)。相対パスまたは絶対パスを指定できる。',
    needsApproval: false, // section5　読取のみゆえ、承認不要
    parameters: {
        type: 'object',
        properties: {
            path: {
                type: "string",
                description: "読み込むファイルのパス（例：'README.md', 'src/index.ts' )"
            }
        },
        required: ['path'],
    },
    execute: readFileExecute, // 上で実装した関数を紐づける
}
