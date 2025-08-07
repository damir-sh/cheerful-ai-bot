import { Stack, Typography } from "@mui/material";

/*
	Empty state for messages list
*/

export const EmptyState = () => {
	return (
		<Stack
			direction="column"
			alignItems="center"
			justifyContent="center"
			height="100%"
			spacing={2}
		>
			<Typography variant="h6" color="text.secondary">
				Send a message to cheer you up 💞
			</Typography>
		</Stack>
	);
};
