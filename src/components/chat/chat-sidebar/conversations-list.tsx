"use client";

import {
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from "@mui/material";
import Link from "next/link";

import { formatConversationTime } from "../utils/date-formatting";
import { getPreviewText } from "./utils";

import { useChat } from "../context";
import { PaginationTrigger } from "./pagination-trigger";
import { Prisma } from "@/generated/prisma";

interface ConversationsListProps {
	conversations: Prisma.ConversationGetPayload<{
		include: {
			messages: true;
		};
	}>[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

/*
	Display component for chats sidebar
*/

export const ConversationsList = ({
	conversations,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: ConversationsListProps) => {
	const { selectedConversationId } = useChat();
	return (
		<List
			sx={{
				flex: 1,
				overflow: "auto",
				p: 0,
				"&::-webkit-scrollbar": {
					display: "none",
				},
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{conversations.map((conversation) => (
				<ListItem key={conversation.id} disablePadding>
					<Link
						href={`/${conversation.id}`}
						style={{
							textDecoration: "none",
							color: "inherit",
							width: "100%",
						}}
					>
						<ListItemButton
							selected={selectedConversationId === conversation.id}
							sx={{
								py: 1.5,
								px: 2,
								"&.Mui-selected": {
									backgroundColor: "action.selected",
								},
							}}
						>
							<ListItemText
								primary={
									<Typography variant="body2" noWrap>
										{getPreviewText(conversation)}
									</Typography>
								}
								secondary={
									<Typography variant="caption" color="text.secondary">
										{formatConversationTime(conversation.updatedAt)}
									</Typography>
								}
							/>
						</ListItemButton>
					</Link>
				</ListItem>
			))}
			<PaginationTrigger
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</List>
	);
};
