import { publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { formatServerError } from "../utils";
import { tryCatch } from "@/lib/try-catch";

/*
	Deletes a conversation
*/

export const deleteConversationProcedure = publicProcedure
	.input(
		z.object({
			conversationId: z.string(),
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { data: conversationExists, error: conversationError } =
			await tryCatch(
				ctx.prisma.conversation.findUnique({
					where: {
						id: input.conversationId,
					},
				})
			);

		if (conversationError) {
			formatServerError(conversationError);
		}

		if (!conversationExists) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Conversation not found",
			});
		}

		const { error: deleteError } = await tryCatch(
			ctx.prisma.conversation.delete({
				where: {
					id: conversationExists.id,
				},
			})
		);

		if (deleteError) {
			formatServerError(deleteError);
		}

		return null;
	});
