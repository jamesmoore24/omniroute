import OpenAI from "openai";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});
