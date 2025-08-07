import { Alert } from "@mui/material";

interface ChatErrorProps {
	error: string;
}

/*
	Error message for chat input
*/

export const ChatError = ({ error }: ChatErrorProps) => {
	return (
		<Alert severity="error" sx={{ mt: 2 }}>
			{error}
		</Alert>
	);
};
