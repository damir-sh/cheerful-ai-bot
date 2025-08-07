"use client";

import { Button } from "@mui/material";
import { useChat } from "../context";
import { trpc } from "@/lib/trpc/client";
import { useToast } from "@/components/toast-provider";
import { getClientErrorMessage } from "@/lib/error-message";
import { useRouter } from "next/navigation";

/*
	Button to delete a chat
*/

export const DeleteChatButton = () => {
	const { selectedConversationId } = useChat();
	const { showSuccess, showError } = useToast();
	const router = useRouter();

	if (!selectedConversationId) return null;

	const utils = trpc.useUtils();
	const { mutate: deleteChat, isPending } =
		trpc.conversation.deleteConversation.useMutation({
			onSuccess: () => {
				showSuccess("Chat deleted");
				utils.conversation.getConversations.invalidate();

				router.push("/");
			},
			onError: (error) => {
				showError(getClientErrorMessage(error));
			},
		});

	const handleDelete = () => {
		deleteChat({ conversationId: selectedConversationId });
	};

	return (
		<Button
			size="small"
			variant="text"
			onClick={handleDelete}
			disabled={isPending}
			color="error"
		>
			Delete Chat
		</Button>
	);
};
