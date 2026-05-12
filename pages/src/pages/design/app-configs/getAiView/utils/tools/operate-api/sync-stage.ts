import CodeFiles from "../codeFiles";
import { createRequestStream } from "../request";
import { getOperateApiParams } from "./index";

const API_URL = "/biz/v2/ai/batchGenerateModuleStream";

const FILE_WHITELIST = [
  "dataSource.ts",
  "scheme.ts",
  "setup.ts",
  "requirement.md",
];

type FilesResult = {
  apiScheme: any[];
  requirement: string;
};

type SyncStageResult = {
  rawResponse: any;
  output: string;
};

type ApiDocItem = {
  id: string;
  cnName: string;
  name: string;
  baseUrl: string;
  method: string;
  path: string;
  response?: any;
  request?: any;
};

function formatShemeObj(content: string) {
  const match = content.match(/const\s+scheme\s*=\s*(\[[\s\S]*?\])\s*;?/);
  if (!match?.[1]) return [];

  try {
    const result = new Function(`return (${match[1]})`)();
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}


/**
 *  根据接口文档生成简要总结，供用户查看
 * @param apiDocs 
 * @returns 
 */
function summarizeApiDocs(apiDocs: ApiDocItem[]) {
  if (!Array.isArray(apiDocs) || apiDocs.length === 0) {
    return "未获取到接口文档，dataSource.ts 和 setup.ts 无需更新，跳过接口同步。";
  }

  const schemeFileContent = `const scheme = ${JSON.stringify(apiDocs, null, 2)};\n\nexport default scheme;\n`;

  return [
    "已获取到接口文档。",
    "请使用 write-file 将下方完整内容覆盖写入 scheme.ts，不要使用 edit-file，不要改写、删减、重排字段内容。",
    "写入完成后，再基于最新的 scheme.ts 同步 dataSource.ts 和 setup.ts。",
    "scheme.ts 完整内容如下：",
    schemeFileContent,
  ].join("\n\n");
}

/**
 *  格式化当前项目的接口相关文件内容，供接口变更记录整理使用
 * @returns 
 */
export function formatFiles(): FilesResult {
  const codeFiles = new CodeFiles(FILE_WHITELIST);
  const files = codeFiles.getFilesJson();
  const schemeFile = files.find((file: any) => file.fileName === "scheme.ts");
  const scheme = formatShemeObj(schemeFile?.content || "");

  const requirement = files.find(
    (file: any) => file.fileName === "requirement.md",
  );

  if(!requirement) {
    console.warn("未找到 requirement.md 文件，接口变更记录整理可能缺乏必要的用户需求上下文信息");
    throw new Error("未生成requirement.md 文件");
  }
  
  return {
    apiScheme: scheme,
    requirement: requirement?.content || "",
  };
}

function parseResponse(raw: any) {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

export async function syncState(fileId: string, content: string, filesObj: FilesResult): Promise<SyncStageResult> {

  return new Promise<SyncStageResult>((resolve, reject) => {
    let accumulated = "";

    const requestStream = createRequestStream({
      url: API_URL,
      method: "POST",
      body: {
        summary: content,
        sessionId: fileId,
        ...filesObj,
        ...getOperateApiParams(),
      },
    });

    requestStream({
      emits: {
        write: (chunk) => {
          accumulated += chunk;
        },
        complete: () => {
          const rawResponse = parseResponse(accumulated);
          resolve({
            rawResponse,
            output: summarizeApiDocs(rawResponse),
          });
        },
        error: reject,
        cancel: () => {},
      },
    });
  });
}
