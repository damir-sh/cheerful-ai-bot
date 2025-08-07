import { tryCatch } from "@/lib/try-catch";
import { publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { formatServerError } from "../utils";

/*
	Resets a conversation
*/

export const clearConversationProcedure = publicProcedure
	.input(
		z.object({
			conversationId: z.string(),
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { data: conversationExists, error } = await tryCatch(
			ctx.prisma.conversation.findUnique({
				where: {
					id: input.conversationId,
				},
			})
		);

		if (error) {
			formatServerError(error);
		}

		if (!conversationExists) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Conversation not found",
			});
		}

		const { error: deleteError } = await tryCatch(
			ctx.prisma.conversationMessage.deleteMany({
				where: {
					conversationId: input.conversationId,
				},
			})
		);

		if (deleteError) {
			formatServerError(deleteError);
		}

		return null;
	});
