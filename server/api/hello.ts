import { ChatOpenAI } from "@langchain/openai";

export default defineEventHandler((event) => {
  // const llm = new ChatOpenAI({
  //   model: "gpt-4o-mini",
  //   temperature: 0,
  // });

  // const res = llm.invoke();
  const name = getRouterParam(event, "name");

  return `Hello, ${name}!`;
});
