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
          providerId: "moonshot",
          baseUrl: "https://api.moonshot.cn/v1/chat/completions",
          apiKey: "sk-NAsSLjFQu5iRlJG7apUD6ZKMxCPS5RyS1EkJKX0ryXJEcj7n",
          models: [
            {
              id: "kimi-k2.6",
              name: "Kimi-K2.6",
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
