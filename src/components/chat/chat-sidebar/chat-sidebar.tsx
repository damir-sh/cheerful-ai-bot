"use client";

import { Typography, CircularProgress, Divider, Stack } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { EmptyState } from "./empty-state";
import { ConversationsList } from "./conversations-list";
import { StartChatButton } from "../start-chat-button";
import { LoadingState } from "./loading-state";

/*
	Displays all conversations
*/

export function ChatSidebar() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		trpc.conversation.getConversations.useInfiniteQuery(
			{
				limit: 50,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);

	const conversations = data?.pages.flatMap((page) => page.conversations);

	if (isLoading) {
		return <LoadingState />;
	}

	return (
		<Stack
			height="100%"
			direction="column"
			width="100%"
			sx={{ backgroundColor: "grey.900" }}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				p={2}
			>
				<Typography
					variant="h3"
					fontWeight={700}
					color="text.primary"
					fontSize={18}
				>
					Chats
				</Typography>
				<StartChatButton type="icon" />
			</Stack>
			<Divider />
			{!conversations || conversations.length === 0 ? (
				<EmptyState />
			) : (
				<ConversationsList
					conversations={conversations}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
				/>
			)}
			{isFetchingNextPage && (
				<Stack alignItems="center">
					<CircularProgress size={24} />
				</Stack>
			)}
		</Stack>
	);
}
