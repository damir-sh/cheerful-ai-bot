"use client";

import { Stack, CircularProgress, Button } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { useChat } from "../context";
import { Message } from "./message";
import { useEffect, useRef, useMemo } from "react";
import { LoadingState } from "./loading-state";
import { NoSelectedChat } from "./no-selected-chat";
import { EmptyState } from "./empty-state";

/*
	- Loads messages via tRPC query
	- Scrolls to bottom when new messages are added
	- Pagination (When scrolling up)
	- Handles empty / loading states
*/

export function MessagesList() {
	const { selectedConversationId } = useChat();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isLoadingMoreRef = useRef(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const previousScrollHeightRef = useRef(0);

	const conversationIdToQuery = selectedConversationId;

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		trpc.conversation.getConversation.useInfiniteQuery(
			{ conversationId: conversationIdToQuery!, limit: 10 },
			{
				enabled: !!conversationIdToQuery,
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			}
		);

	const messages = useMemo(() => {
		const rawMessages =
			data?.pages.flatMap((page) => page.messages || []) ?? [];
		return rawMessages.reverse();
	}, [data]);

	const handleLoadMore = () => {
		if (!hasNextPage || isFetchingNextPage) return;
		isLoadingMoreRef.current = true;
		if (scrollContainerRef.current) {
			previousScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
		}
		fetchNextPage();
	};

	useEffect(() => {
		if (!data) return;
		if (isLoadingMoreRef.current && scrollContainerRef.current) {
			const newScrollHeight = scrollContainerRef.current.scrollHeight;
			const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
			scrollContainerRef.current.scrollTop += scrollDiff;
			isLoadingMoreRef.current = false;
		} else {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [data]);

	if (!conversationIdToQuery) {
		return <NoSelectedChat />;
	}

	if (isLoading) {
		return <LoadingState />;
	}

	if (messages.length === 0) {
		return <EmptyState />;
	}

	return (
		<Stack
			ref={scrollContainerRef}
			spacing={2}
			overflow="auto"
			sx={{
				scrollbarWidth: "none",
			}}
			flex={1}
			pt={2}
		>
			{hasNextPage && (
				<Stack direction="row" justifyContent="center" py={1}>
					{isFetchingNextPage ? (
						<CircularProgress size={24} />
					) : (
						<Button onClick={handleLoadMore} variant="outlined" size="small">
							Load More
						</Button>
					)}
				</Stack>
			)}
			{messages?.map((message) => (
				<Message key={message.id} message={message} />
			))}
			<div ref={messagesEndRef} />
		</Stack>
	);
}
