import { ConversationMessage, Prisma } from "@/generated/prisma";

type ConversationWithMessages = Prisma.ConversationGetPayload<{
	include: {
		messages: true;
	};
}>;

const MAX_PREVIEW_LENGTH = 50;

/*
	Preview text for chat list items
	E.g. "You: Hello, how are you?" or "Hello, how are you?"
*/

export const getPreviewText = (
	conversation: ConversationWithMessages
): string => {
	if (!conversation.messages || conversation.messages.length === 0) {
		return "New chat";
	}
	const lastMessage = conversation.messages[0];
	const preview =
		lastMessage.content.length > MAX_PREVIEW_LENGTH
			? `${lastMessage.content.substring(0, MAX_PREVIEW_LENGTH)}...`
			: lastMessage.content;
	return lastMessage.originator === "USER" ? `You: ${preview}` : preview;
};
