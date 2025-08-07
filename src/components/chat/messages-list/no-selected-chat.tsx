import { Stack, Typography } from "@mui/material";
import { StartChatButton } from "../start-chat-button";

/*
	Empty state for messages list
*/

export const NoSelectedChat = () => {
	return (
		<Stack
			direction="column"
			alignItems="center"
			justifyContent="center"
			height="100%"
			spacing={2}
		>
			<Typography variant="h6" color="text.secondary">
				Time to get all cheered up 💞
			</Typography>
			<StartChatButton type="text" />
		</Stack>
	);
};
