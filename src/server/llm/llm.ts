import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
	throw new Error("OPENROUTER_API_KEY is not set");
}

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey,
});

/*
	Improvements I could make here:
	- Introduce actual streaming of tokens to the client
*/

export async function generateAIResponse({
	messages,
	useJsonFormat = false,
	maxTokens,
}: {
	messages: ChatCompletionMessageParam[];
	useJsonFormat?: boolean;
	maxTokens: number;
}): Promise<string> {
	const completion = await openai.chat.completions.create({
		// Gemini 2.0 is super fast and cheap. Fits this task perfectly.
		// 1.05M context tokens
		// $0.10/M input tokens
		// $0.40/M output tokens
		model: "google/gemini-2.0-flash-001",
		messages: [...messages],
		temperature: 0.8,
		max_tokens: maxTokens,
		response_format: useJsonFormat ? { type: "json_object" } : undefined,
	});
	const response = completion.choices[0]?.message?.content;
	if (!response) {
		throw new Error("No response from AI");
	}
	return response;
}
