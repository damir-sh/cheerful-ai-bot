import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { type ConversationMessage } from "@/generated/prisma";
import { formatMessageTime } from "../utils/date-formatting";

interface MessageProps {
	message: ConversationMessage;
}

/*
	Displays single message
*/

export const Message = React.memo(({ message }: MessageProps) => {
	const isUser = message.originator === "USER";

	return (
		<Box
			key={message.id}
			sx={{
				display: "flex",
				justifyContent: isUser ? "flex-end" : "flex-start",
				width: "100%",
			}}
		>
			<Paper
				sx={{
					p: 2,
					maxWidth: "70%",
					minWidth: 0,
					wordWrap: "break-word",
					overflowWrap: "break-word",
					backgroundColor: isUser ? "grey.900" : "primary.main",
					color: isUser ? "text.primary" : "primary.contrastText",
					borderRadius: "18px",
					borderTopRightRadius: isUser ? "6px" : "18px",
					borderTopLeftRadius: !isUser ? "6px" : "18px",
				}}
			>
				<Typography
					variant="body1"
					sx={{
						wordWrap: "break-word",
						overflowWrap: "break-word",
						whiteSpace: "pre-wrap",
					}}
				>
					{message.content}
				</Typography>
				<Typography
					variant="caption"
					sx={{
						display: "block",
						mt: 0.5,
						opacity: 0.7,
						fontSize: "0.75rem",
					}}
				>
					{formatMessageTime(message.createdAt)}
				</Typography>
			</Paper>
		</Box>
	);
});
