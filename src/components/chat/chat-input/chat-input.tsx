"use client";

import { Stack, TextField, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useChatInput } from "./use-chat-input";
import { ThinkingIndicator } from "./thinking-indicator";
import { ChatError } from "./chat-error";
import { useChat } from "../context";

/*
	Chat input component
*/

export function ChatInput() {
	const {
		inputText,
		setInputText,
		handleSend,
		handleKeyPress,
		isSending,
		error,
	} = useChatInput();
	const { selectedConversationId } = useChat();

	if (!selectedConversationId) {
		return null;
	}

	return (
		<>
			{isSending && <ThinkingIndicator />}
			{error && <ChatError error={error} />}
			<Stack direction="row" py={2} gap={1}>
				<TextField
					fullWidth
					multiline
					maxRows={3}
					placeholder="Type a message..."
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					onKeyUp={handleKeyPress}
					variant="outlined"
					size="small"
					disabled={isSending}
					sx={{
						"& .MuiOutlinedInput-root": {
							borderRadius: "20px",
						},
					}}
				/>
				<Stack direction="row" justifyContent="center" alignItems="center">
					<IconButton
						onClick={handleSend}
						disabled={!inputText.trim() || isSending}
					>
						<SendIcon />
					</IconButton>
				</Stack>
			</Stack>
		</>
	);
}
