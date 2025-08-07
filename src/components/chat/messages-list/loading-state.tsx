import { CircularProgress, Stack, Typography } from "@mui/material";

/*
	Loading state for messages list
*/

export const LoadingState = () => {
	return (
		<Stack
			direction="column"
			alignItems="center"
			justifyContent="center"
			height="100%"
		>
			<CircularProgress />
			<Typography variant="body2" sx={{ mt: 2 }}>
				Loading chat...
			</Typography>
		</Stack>
	);
};
