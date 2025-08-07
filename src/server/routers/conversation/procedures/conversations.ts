import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { tryCatch } from "@/lib/try-catch";
import { formatServerError } from "../utils";

/*
	Returns all conversations
	- Pagination
	- Cursor based pagination
	- Limit is max 50 conversations
*/

export const getConversationsProcedure = publicProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(50).default(50),
			cursor: z.string().optional(),
		})
	)
	.query(async ({ ctx, input }) => {
		const { limit, cursor } = input;

		const { data: conversations, error } = await tryCatch(
			ctx.prisma.conversation.findMany({
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
				skip: cursor ? 1 : 0,
				include: {
					messages: {
						orderBy: {
							createdAt: "desc",
						},
						take: 1,
					},
				},
				orderBy: {
					updatedAt: "desc",
				},
			})
		);

		if (error) {
			formatServerError(error);
		}

		if (!conversations) {
			return {
				conversations: [],
				nextCursor: undefined,
			};
		}

		let nextCursor: string | undefined = undefined;
		if (conversations.length > limit) {
			const nextItem = conversations.pop();
			if (nextItem) {
				nextCursor = nextItem.id;
			}
		}

		return {
			conversations,
			nextCursor,
		};
	});
