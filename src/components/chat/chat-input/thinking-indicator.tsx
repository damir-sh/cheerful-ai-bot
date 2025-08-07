import { Box, CircularProgress, Typography } from "@mui/material";

/*
	Loading state for chat input
*/

export const ThinkingIndicator = () => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", py: 1, gap: 1 }}>
			<CircularProgress size={20} />
			<Typography variant="body2" sx={{ ml: 1 }}>
				Thinking of something cheerful to say...
			</Typography>
		</Box>
	);
};
