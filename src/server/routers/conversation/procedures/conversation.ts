import { tryCatch } from "@/lib/try-catch";
import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { formatServerError } from "../utils";

/*
	Returns conversation with messages by ID
	- Pagination
	- Cursor based pagination
	- Limit is max 10 messages

	For scalability, I would introduce a Redis cache layer.
	Redis grabs messages from cache first.
	Older messages are archived to PSQL.
*/

export const getConversationProcedure = publicProcedure
	.input(
		z.object({
			conversationId: z.string(),
			limit: z.number().min(1).max(10).default(10),
			cursor: z.string().optional(),
		})
	)
	.query(async ({ ctx, input }) => {
		const { data: conversation, error } = await tryCatch(
			ctx.prisma.conversation.findUnique({
				where: {
					id: input.conversationId,
				},
				include: {
					messages: {
						orderBy: [{ createdAt: "desc" }, { id: "desc" }],
						take: input.limit + 1,
						cursor: input.cursor ? { id: input.cursor } : undefined,
						skip: 0,
					},
				},
			})
		);

		if (error) {
			formatServerError(error);
		}

		if (!conversation) {
			return {
				messages: [],
				nextCursor: undefined,
			};
		}

		let nextCursor: string | undefined = undefined;
		if (
			conversation.messages.length &&
			conversation.messages.length > input.limit
		) {
			const nextItem = conversation.messages.pop();
			nextCursor = nextItem!.id;
		}

		return {
			messages: conversation.messages,
			nextCursor,
		};
	});
