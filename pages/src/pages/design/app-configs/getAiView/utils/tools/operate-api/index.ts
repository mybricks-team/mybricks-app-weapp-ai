import { renderOperateApiTool } from "./render";
import { checkState } from "./check-stage";
import { getOperateApiSummary } from "./summary-state";

import { syncState, formatFiles } from "./sync-stage";
import {
  createExecuteErrorResult,
  createNoNeedSyncResult,
  createSummaryFailedResult,
  createVerifyFailResult,
  createVerifySuccessResult,
  type OperateApiResult,
} from "./result";

export const OPERATE_API_TOOL_NAME = "operate-api";

export function createOperateApiTool(fileId: string) {
  return {
    name: OPERATE_API_TOOL_NAME,
    title: "操作接口",
    description:
      "根据当前用户需求先整理接口变更记录，根据当前用户需求请求后端服务，操作接口，保持前后端的一致性。",
    render: renderOperateApiTool,
    parameters: {
      type: "object",
      properties: {},
    },
    async execute(_params: any, toolContext: any): Promise<OperateApiResult> {
      try {
        const filesObj = formatFiles();

        toolContext.emitProgress?.({
          stage: "pending",
          message: "正在检查接口",
        });

        const check = await checkState(filesObj.apiScheme, fileId);
        if (check) {
          toolContext.emitProgress?.({
            stage: "success",
            message: "接口无需变更",
          });
          return createNoNeedSyncResult();
        }

        toolContext.emitProgress?.({
          stage: "pending",
          message: "正在收集接口所需的上下文信息",
        });

        const { summary, reusedSummary } = await getOperateApiSummary({
          fileId,
          filesObj,
          toolContext,
        });

        if (!summary) {
          return createSummaryFailedResult();
        }

        toolContext.emitProgress?.({
          stage: "pending",
          message: reusedSummary ? "正在同步接口（复用上次变更记录）" : "正在同步接口",
        });

        const result = await syncState(fileId, summary, filesObj);
        console.log('=====result', result)
        if (!Array.isArray(result.rawResponse) || result.rawResponse.length === 0) {
          toolContext.emitProgress?.({
            stage: "error",
            message: "接口同步完成，但后端未返回有效接口数据，请重试",
          });
          return createVerifyFailResult({
            summary,
            rawResponse: result.rawResponse,
            reusedSummary,
          });
        }

        toolContext.emitProgress?.({
          stage: "success",
          message: "接口同步成功",
        });

        return createVerifySuccessResult({
          output: result.output,
          summary,
          rawResponse: result.rawResponse,
          reusedSummary,
        });
      } catch (error) {
        toolContext.emitProgress?.({
          stage: "error",
          message: `接口同步失败：${error instanceof Error ? error.message : String(error)}`,
        });

        return createExecuteErrorResult(error);
      }
    },
  };
}
