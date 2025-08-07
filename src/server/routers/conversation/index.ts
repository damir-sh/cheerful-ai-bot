import { router } from "@/server/trpc";
import {
	getConversationProcedure,
	getConversationsProcedure,
	sendMessageProcedure,
	createConversationProcedure,
	deleteConversationProcedure,
	clearConversationProcedure,
} from "./procedures";

export const conversationRouter = router({
	getConversation: getConversationProcedure,
	getConversations: getConversationsProcedure,
	sendMessage: sendMessageProcedure,
	createConversation: createConversationProcedure,
	clearConversation: clearConversationProcedure,
	deleteConversation: deleteConversationProcedure,
});
