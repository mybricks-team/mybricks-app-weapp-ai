import React from "react";
import { PendingCodeCard, CodeCard, FileIcon, type ToolRecord } from "./render/components";

function getPreviewContent(tool: ToolRecord) {
  if (typeof tool.result?.output === "string" && tool.result.output) {
    return tool.result.output;
  }
  return "";
}

export function renderOperateApiTool(tool: ToolRecord) {
  if (tool.status === "pending") {
    return <PendingCodeCard tool={tool} icon={<FileIcon />} title={tool?.progress?.message || "正在操作接口..."} />;
  }

  return (
    <CodeCard
      tool={tool}
      icon={<FileIcon />}
      title={tool.title || "操作接口"}
      content={getPreviewContent(tool)}
      showCode={Boolean(getPreviewContent(tool))}
    />
  );
}
