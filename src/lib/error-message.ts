import { TRPCClientError } from "@trpc/client";

/*
	Helper function to get error message from client
	- Handles normal errors
	- Handles Zod validation errors
*/

export function getClientErrorMessage(error: unknown): string {
	if (error instanceof TRPCClientError) {
		try {
			// Try to parse the error message as JSON to extract Zod validation errors
			const parsedError = JSON.parse(error.message);
			if (Array.isArray(parsedError) && parsedError.length > 0) {
				// Return the first validation error message
				return parsedError[0].message;
			}
		} catch {
			// If parsing fails, fall back to the original message
		}
		return error.message;
	}

	// Handle TRPC errors that contain Zod validation errors
	if (error instanceof Error) {
		const message = error.message;
		return message || "An error occurred. Please try again.";
	}

	return "An error occurred. Please try again.";
}
