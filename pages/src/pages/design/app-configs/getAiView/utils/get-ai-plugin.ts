import AIPlugin from "@mybricks/plugin-ai";
import componentRuntime from "./componentRuntime";
import promptSections from "./prompt";
import skills from "./skills";

export default ({ user, key }: any) => {

  return AIPlugin({
    user,
    key,
    llm: {
      providers: [
        {
          format: "openai",
          providerId: "manateeai",
          baseUrl: "https://new-api.manateeai.com/v1/chat/completions",
          apiKey: "sk-8M0pxwcucVOECOFhB470Ea9d09444882A8A955F5863194E8",
          models: [
            {
              id: "kimi-k2.6",
              name: "Kimi-K2.6",
            },
            {
              id: "deepseek-v4-flash",
              name: "deepseek-v4-flash",
            },
            {
              id: "deepseek-v4-pro",
              name: "deepseek-v4-pro",
            },
          ],
        }
      ],
    },
    skills,
    // ------ taro ------
    componentRuntime,
    promptSections,
  });
};
