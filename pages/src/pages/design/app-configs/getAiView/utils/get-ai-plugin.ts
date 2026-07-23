import AIPlugin from "@mybricks/plugin-ai";
import componentRuntime from "./componentRuntime";
import promptSections from "./prompt";
import { createOperateApiTool } from "./tools/operate-api";
import skills from "./skills";
import { onRequest } from "@/utils/aiRequest";

export default ({ user, key }: any) => {
  const operateApiTool = createOperateApiTool(key);

  return AIPlugin({
    user,
    key,
    llm: {
      providers: [
        {
          providerId: "auto",
          models: [
            {
              id: "glm-5.2",
              name: "glm-5.2",
            },
            {
              id: "kimi-k2.7-code-highspeed",
              name: "kimi-k2.7-code-highspeed"
            },
            {
              id: "kimi-k2.6",
              name: "kimi-k2.6"
            },
            {
              id: "kimi-k2.7-code",
              name: "kimi-k2.7-code",
            },
            {
              id: "deepseek-v4-pro",
              name: "deepseek-v4-pro",
            },
            {
              id: "deepseek-v4-flash",
              name: "deepseek-v4-flash"
            }, 
          ],
          request: onRequest,
        },
      ],
    },
    tools: [operateApiTool],
    skills,
    // ------ taro ------
    componentRuntime,
    promptSections,
  });
};
