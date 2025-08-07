import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface DatabaseMessage {
	content: string;
	originator: string;
	createdAt: Date | string;
}

export function formatMessages(
	messages: DatabaseMessage[]
): ChatCompletionMessageParam[] {
	return messages.map((message) => ({
		role:
			message.originator === "USER"
				? ("user" as const)
				: ("assistant" as const),
		content: message.content,
	}));
}
