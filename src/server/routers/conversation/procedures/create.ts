import { tryCatch } from "@/lib/try-catch";
import { publicProcedure } from "@/server/trpc";
import { formatServerError } from "../utils";
import { TRPCError } from "@trpc/server";

/*
	Creates a new conversation
*/

export const createConversationProcedure = publicProcedure.mutation(
	async ({ ctx }) => {
		const { data: conversation, error } = await tryCatch(
			ctx.prisma.conversation.create({
				data: {
					messages: {
						create: {
							content: "Hey! How can I cheer you up today? 💞",
							originator: "BOT",
						},
					},
				},
				include: {
					messages: true,
				},
			})
		);

		if (error) {
			formatServerError(error);
		}

		if (!conversation) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create conversation",
			});
		}

		return conversation;
	}
);
