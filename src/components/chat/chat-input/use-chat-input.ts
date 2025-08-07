"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useChat } from "../context";
import { getClientErrorMessage } from "@/lib/error-message";

/**
  Custom hook for managing chat input functionality with optimistic updates.
  Handles:
  - Input state management
  - Message sending with optimistic UI updates
  - Error handling and rollback
  - Loading states
  - Keyboard interactions
 */
export function useChatInput() {
	const { selectedConversationId } = useChat();

	// Local state for the input field
	const [inputText, setInputText] = useState("");

	// Error state for displaying user-friendly error messages
	const [error, setError] = useState<string | null>(null);

	const utils = trpc.useUtils();

	// Main mutation for sending messages with comprehensive optimistic updates
	const sendMessageMutation = trpc.conversation.sendMessage.useMutation({
		/**
		 * onMutate: Runs immediately when mutation is called, before the server request.
		 * Used for optimistic updates - immediately show the user's message in the UI
		 * while the actual request is processing in the background.
		 */
		async onMutate(variables) {
			if (!selectedConversationId) {
				throw new Error("Conversation ID is required");
			}

			// Clear any previous errors
			setError(null);

			// Query configuration for the conversation we're updating
			const queryInput = {
				conversationId: selectedConversationId,
				limit: 10,
			};

			// Cancel any in-flight queries to prevent race conditions
			// This ensures our optimistic update doesn't get overwritten
			await utils.conversation.getConversation.cancel(queryInput);

			// Store the current data so we can rollback if the mutation fails
			const previousData =
				utils.conversation.getConversation.getInfiniteData(queryInput);

			// Create a temporary message for optimistic UI
			// Uses timestamp-based ID to ensure uniqueness
			const tempMessageId = `temp-msg-${Date.now()}`;
			const optimisticMessage = {
				id: tempMessageId,
				content: variables.content,
				originator: "USER",
				conversationId: selectedConversationId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Optimistically update the cache with the new message
			// Add it to the beginning of the first page (most recent messages)
			utils.conversation.getConversation.setInfiniteData(
				queryInput,
				(oldData) => {
					if (!oldData) {
						return undefined;
					}

					// Clone the pages array to avoid mutations
					const newPages = [...oldData.pages];
					const firstPage = { ...newPages[0] };

					// Add the optimistic message at the beginning (most recent)
					firstPage.messages = [optimisticMessage, ...firstPage.messages];
					newPages[0] = firstPage;

					return {
						...oldData,
						pages: newPages,
					};
				}
			);

			// Return context for use in onError and onSuccess
			return {
				previousData,
				tempMessageId,
			};
		},

		/**
		 * onError: Runs if the mutation fails.
		 * Rollback optimistic updates and show error message to user.
		 */
		onError: (error, __, context) => {
			// Convert the error to a user-friendly message
			setError(getClientErrorMessage(error));

			if (!context) return;

			// Rollback the optimistic update by restoring previous data
			const { previousData } = context;
			const queryInput = {
				conversationId: selectedConversationId!,
				limit: 10,
			};
			utils.conversation.getConversation.setInfiniteData(
				queryInput,
				() => previousData
			);
		},

		/**
		 * onSuccess: Runs when the mutation succeeds.
		 * Replace the optimistic message with the real data from the server.
		 */
		onSuccess: (result, __, context) => {
			const { tempMessageId } = context;

			// Update the cache with the real query input (conversationId might have changed)
			const realQueryInput = {
				conversationId: result.conversationId,
				limit: 10,
			};

			// Replace optimistic data with real server response
			utils.conversation.getConversation.setInfiniteData(
				realQueryInput,
				(oldData) => {
					const newPages = oldData?.pages
						? [...oldData.pages]
						: [{ messages: [], nextCursor: undefined }];

					const firstPageMessages = newPages[0]?.messages ?? [];

					// Remove the temporary optimistic message
					const messagesWithoutOptimistic = firstPageMessages.filter(
						(m) => m.id !== tempMessageId
					);

					// Add the real messages from the server response
					// Bot message first, then user message (chronological order)
					const updatedMessages = [
						result.botMessage,
						result.userMessage,
						...messagesWithoutOptimistic,
					];

					newPages[0] = {
						...newPages[0],
						messages: updatedMessages,
					};

					return {
						pages: newPages,
						pageParams: oldData?.pageParams ?? [],
					};
				}
			);

			// Invalidate related queries to ensure data consistency
			// This will refetch the conversations list (to update preview/timestamp)
			utils.conversation.getConversations.invalidate();
		},
	});

	// Derived state for loading indicator
	const isSending = sendMessageMutation.isPending;

	/**
	 * Handle sending a message.
	 * Validates input and triggers the mutation.
	 */
	const handleSend = () => {
		if (inputText.length > 1000) {
			setError("Message is too long. Please keep it under 1000 characters.");
			return;
		}

		const inputTextTrimmed = inputText.trim();

		// Prevent sending empty messages or multiple concurrent sends
		if (inputTextTrimmed.length === 0 || isSending) return;

		// Clear the input immediately for better UX
		setInputText("");

		// Trigger the mutation with optimistic updates
		sendMessageMutation.mutate({
			content: inputTextTrimmed,
			conversationId: selectedConversationId!,
		});
	};

	/**
	 * Handle keyboard interactions in the input field.
	 * Enter = send message, Shift+Enter = new line
	 */
	const handleKeyPress = (e: React.KeyboardEvent) => {
		// Only handle Enter key, allow Shift+Enter for new lines
		if (e.key !== "Enter" || e.shiftKey) return;

		// Prevent the default Enter behavior (new line)
		e.preventDefault();
		handleSend();
	};

	// Return all the state and handlers needed by the component
	return {
		inputText,
		setInputText,
		handleSend,
		handleKeyPress,
		isSending,
		error,
	};
}
