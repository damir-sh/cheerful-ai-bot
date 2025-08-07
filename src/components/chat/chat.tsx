"use client";

import { Box, Stack, Typography } from "@mui/material";
import { ChatProvider } from "./context";
import { ChatSidebar } from "./chat-sidebar";
import { ChatInput } from "./chat-input";
import { MessagesList } from "./messages-list";
import { ResetChatButton } from "./reset-chat-button";
import { DeleteChatButton } from "./delete-chat-button";

/*
	Main chat component
	- Conversation ID is managed through the context (URL param based)
	- State is handled through query / mutation
*/

export const Chat = () => {
	return (
		<ChatProvider>
			<Stack
				direction="row"
				flex={1}
				height="100%"
				borderRadius={8}
				overflow="hidden"
				border={`1px solid white`}
			>
				<Box width="25%" height="100%" display="flex" flexDirection="column">
					<ChatSidebar />
				</Box>
				<Box width="75%" height="100%">
					<Stack
						width="100%"
						direction="column"
						height="100%"
						overflow="hidden"
					>
						<Stack
							bgcolor="grey.900"
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							p={2}
						>
							<Typography variant="h6">Cheerful AI</Typography>
							<Stack direction="row" gap={1}>
								<ResetChatButton />
								<DeleteChatButton />
							</Stack>
						</Stack>
						<Stack px={2} height="100%" overflow="hidden">
							<MessagesList />
							<ChatInput />
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</ChatProvider>
	);
};
