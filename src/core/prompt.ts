import * as fs from 'fs';
import * as path from 'path';

export function loadInstructions(workspaceRoot: string): string {
    //ベースプロンプトを読み込む（必須）
    const basePath = path.resolve(__dirname, 'prompt.md');
    const base = fs.readFileSync(basePath, 'utf-8');

    //AGENTS.mdを読み込む（存在する場合）
    const agentsMdPath = path.resolve(workspaceRoot, 'AGENTS.md');
    if (fs.existsSync(agentsMdPath)) {
        const agentsMd = fs.readFileSync(agentsMdPath, 'utf-8');
        return `${base}\n\n# プロジェクト固有の指示\n${agentsMd}`;
    }

    return base;
}
