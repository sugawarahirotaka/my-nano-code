import { readFile } from "./readFile";
import { writeFile } from "./writeFile";
import { editFile } from "./editFile";
import { execCommand } from "./execCommand";

// generateText()関数は、toolsパラメータとして配列を受け取るため、ツールをエクスポートする中央ファイルとして用いる
export const allTools = [
    readFile,
    writeFile,
    editFile,
    execCommand,
];
