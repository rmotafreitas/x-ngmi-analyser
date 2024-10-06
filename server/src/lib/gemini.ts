import "dotenv/config";

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_KEY) {
  throw new Error("GEMINI_KEY is not set");
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
