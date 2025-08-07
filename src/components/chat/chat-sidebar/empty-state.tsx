import { Box, Typography } from "@mui/material";

/*
	Empty state for chats sidebar
*/

export const EmptyState = () => {
	return (
		<Box sx={{ p: 3, textAlign: "center" }}>
			<Typography variant="body2" color="text.secondary">
				No cheerful chats yet 🙁
			</Typography>
		</Box>
	);
};
