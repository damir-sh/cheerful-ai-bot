import { TRPCError } from "@trpc/server";
import { tryCatch } from "@/lib/try-catch";
import { prisma } from "@/lib/db";
import { formatServerError } from "../../utils";

export async function getExistingConversation(conversationId: string) {
	const { data: existingConversation, error } = await tryCatch(
		prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
					take: 100,
				},
			},
		})
	);

	if (error) {
		formatServerError(error);
	}

	if (!existingConversation) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Chat not found",
		});
	}

	return existingConversation;
}
