import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// 30K tokens because most conversations wont need that many tokens
// Cost conscious approach
const MAX_TOKEN_LIMIT_PER_CONVERSATION_HISTORY = 30000;

// This is a very simplistic approach for token estimation.
// There's better tools out there that are more accurate.
function estimateTokens(text: string): number {
	if (!text?.trim()) return 0;

	// ~3.5 chars per token for English.
	const charCount = text.replace(/\s+/g, " ").trim().length;
	return Math.ceil(charCount / 3.5);
}

// Filters out older messages to not exceed the token limit.
export function trimMessagesToTokenLimit({
	systemPrompt,
	messages,
}: {
	systemPrompt: string;
	messages: ChatCompletionMessageParam[];
}) {
	const reversed = [...messages].reverse();

	// System prompt is always included.
	const included = [
		{
			role: "system",
			content: systemPrompt,
		},
	];

	// Set the token count to the system prompt + a little buffer.
	let tokenCount = estimateTokens(systemPrompt) + 10;

	for (const msg of reversed) {
		// Estimate tokens of the message plus add a bit of a buffer. Just in case.
		const messageTokens = estimateTokens(msg.content as string) + 10;
		if (tokenCount + messageTokens > MAX_TOKEN_LIMIT_PER_CONVERSATION_HISTORY)
			break;
		included.push({
			role: msg.role,
			content: msg.content as string,
		});
		// Increment token count
		tokenCount += messageTokens;
	}

	return included.reverse();
}
