import { parseArgs } from 'util';
import * as path from 'path';
import { Agent } from '../src/core/agent';
import { loadInstructions } from '../src/core/prompt';
import { createModelFromEnv } from '../src/providers/modelFactory';
// 第4章で実装された基本ツール
import { readFile } from '../src/tools/readFile';
import { writeFile } from '../src/tools/writeFile';
import { editFile } from '../src/tools/editFile';
import { execCommand as execCommand } from '../src/tools/execCommand';
// // 第8章の統合版 CLI では、通常の execCommand をサンドボックス対応版に差し替える
// import { execCommandSandbox as execCommand } from '../src/tools/execCommandSandbox';
// // 第8章で追加された Web 取得ツール
// import { webFetch } from '../src/tools/webFetch';
// // 第7章で追加された Git / GitHub 連携用ツール
// import { createBranch, commit, pushBranch } from '../src/tools/git';
// import { createPullRequest, createIssueComment } from '../src/tools/github';
// import { mkdirSync, existsSync } from 'fs';
// import { config } from '../src/config'; // 第8章で追加されたサンドボックス等の全体コンフィグ

async function main() {
    // コマンドライン引数を処理
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('使い方: bun run agent "<タスクの説明>"');
        console.error('例: bun run agent "プロジェクトの README.md を更新して、最新の機能を反映させてください。"');
        process.exit(1);
    }

    const userPrompt = args.join(' ');

    // 環境変数からモデルを生成
    const model = createModelFromEnv();

    // 安全設定: workspaceディレクトリ内のみ操作可能
    const workspaceRoot = path.resolve(process.cwd(), 'workspace');

    // プロンプトを読み込む(ベース + AGENTS.md)
    const instructions = loadInstructions(workspaceRoot);

    // エージェントを初期化
    const agent = new Agent({
        name: 'nano-code',
        model,
        instructions, //外部ファイルから読み込んだプロンプト
        tools: {
            readFile,
            writeFile,
            editFile,
            // execCommand,
        },
        maxSteps: 15,
    })

    console.log('エージェントを起動\n');
    console.log(`タスク: ${userPrompt}\n`);
    console.log('─'.repeat(60) + '\n');

    try {
        const result = await agent.generate(userPrompt);
        console.log(result.text);
        console.log('n' + '─'.repeat(60));
        console.log('エージェントのタスクが完了しました。');
    } catch (error) {
        console.error('エージェントの実行中にエラーが発生しました:', error);
        process.exit(1);
    }
}

main();
