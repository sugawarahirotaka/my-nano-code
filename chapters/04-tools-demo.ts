import { writeFile } from "../src/tools/writeFile";
import { readFile } from "../src/tools/readFile";
import { editFile } from "../src/tools/editFile";
import { execCommand } from "../src/tools/execCommand";

async function demo() {
    console.log("=== ツール動作確認 ===");

    // 1. writeFile: ファイルを作成
    console.log("\n--- 1. writeFile ---");
    const writeResult = await writeFile.execute({
        path: 'test.txt',
        content: 'Hello, Nano Code!\nThis is a test file.'
    });
    console.log(`   writeResult: ${writeResult}\n`);

    // 2. readFile: ファイルを読み込む
    console.log("\n--- 2. readFile ---");
    const readResult = await readFile.execute({ path: 'test.txt' });
    console.log(`   readResult:\n${readResult.replace(/\n/g, '\n ')}\n`);

    // 3. editFile: ファイルの内容を編集
    console.log("\n--- 3. editFile ---");
    const editResult = await editFile.execute({
        path: 'test.txt',
        oldText: 'Hello, Nano Code!',
        newText: 'Hello, Nano Code Agent!'
    });
    console.log(`   editResult: ${(editResult)}\n`);

    // 4. readFile: 編集後の内容を再度読み込む
    console.log("\n--- 4. readFile (after edit) ---");
    const readAfterEditResult = await readFile.execute({ path: 'test.txt' });
    console.log(`   readAfterEditResult:\n${readAfterEditResult.replace(/\n/g, '\n ')}\n`);

    // 5. execCommand: ファイル一覧を取得
    console.log("\n--- 5. execCommand ---");
    const execResult = await execCommand.execute({ command: 'ls -la' });
    console.log(`   execResult:\n${execResult.replace(/\n/g, '\n ')}\n`);

    // 6. エラーケース：存在しないファイルの読み込み
    console.log("\n--- 6. readFile (non-existent file) ---");
    try {
        await readFile.execute({ path: 'nonexistent.txt' });
    } catch (error) {
        console.error(`   Caught error: ${(error as Error).message}\n`);
    }

    // 7. セキュリティチェック：ワークスペース外へのアクセス
    console.log("\n--- 7. readFile (access outside workspace) ---");
    try {
        await readFile.execute({ path: '../.env' });
    } catch (error) {
        console.error(`   Caught error: ${(error as Error).message}\n`);
    }

    console.log("=== ツール動作確認終了 ===");
}

demo().catch(console.error);
