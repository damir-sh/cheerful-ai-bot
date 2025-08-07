"use client";

import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

interface StartChatButtonProps {
	type: "icon" | "text";
}

/*
	Button to start a new chat
	We have two types of buttons:
	- Icon button
	- Text button
*/

export const StartChatButton = ({ type }: StartChatButtonProps) => {
	const router = useRouter();
	const { showError } = useToast();

	const utils = trpc.useUtils();

	const { mutate: createConversation, isPending } =
		trpc.conversation.createConversation.useMutation({
			onSuccess: (data) => {
				utils.conversation.getConversations.invalidate();
				router.push(`/${data.id}`);
			},
			onError: (error) => {
				showError(error.message);
			},
		});

	const handleCreateConversation = () => {
		createConversation();
	};

	if (type === "icon") {
		return (
			<IconButton
				loading={isPending}
				onClick={handleCreateConversation}
				size="small"
				sx={{ ml: 1 }}
			>
				<AddIcon />
			</IconButton>
		);
	}

	return (
		<Button variant="contained" onClick={handleCreateConversation}>
			Start New Chat
		</Button>
	);
};
