"use client";

import { Button } from "@mui/material";
import { useChat } from "../context";
import { trpc } from "@/lib/trpc/client";
import { useToast } from "@/components/toast-provider";
import { getClientErrorMessage } from "@/lib/error-message";

/*
	Button to reset a chat
*/

export const ResetChatButton = () => {
	const { selectedConversationId } = useChat();
	const { showSuccess, showError } = useToast();

	if (!selectedConversationId) return null;

	const utils = trpc.useUtils();
	const { mutate: clearChat, isPending } =
		trpc.conversation.clearConversation.useMutation({
			onSuccess: () => {
				showSuccess("Chat cleared");
				utils.conversation.getConversations.invalidate();
				utils.conversation.getConversation.invalidate({
					conversationId: selectedConversationId,
				});
			},
			onError: (error) => {
				showError(getClientErrorMessage(error));
			},
		});

	const handleReset = () => {
		clearChat({ conversationId: selectedConversationId });
	};

	return (
		<Button
			size="small"
			variant="text"
			onClick={handleReset}
			disabled={isPending}
		>
			Reset Chat
		</Button>
	);
};
