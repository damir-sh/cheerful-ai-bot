import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { generateAIResponse } from "@/server/llm";
import { conversationNotesSystemPrompt } from "@/server/llm/system-prompt";
import { prisma } from "@/lib/db";
import { tryCatch } from "@/lib/try-catch";

export async function generateAndSaveNotes(
	messages: ChatCompletionMessageParam[],
	conversationId: string,
	existingNotes: string[]
) {
	const notesResponse = await generateAIResponse({
		messages: [
			{
				role: "system",
				content: conversationNotesSystemPrompt(existingNotes),
			},
			...messages,
		],
		useJsonFormat: true,
		// Cap the response at 100 tokens. Should be enough for a longer note about the user.
		maxTokens: 100,
	});

	let newNotes: string[] = [];

	const { data: parsedNotes, error } = await tryCatch(
		Promise.resolve(JSON.parse(notesResponse))
	);

	if (error) {
		// In case the AI fails to generate a valid JSON, we will just return an empty array here.
		// It's not a big deal, the chat can just continue.
		return newNotes;
	}

	if (
		Array.isArray(parsedNotes) &&
		parsedNotes.every((item) => typeof item === "string")
	) {
		newNotes = parsedNotes;
	}

	if (newNotes.length > 0) {
		await tryCatch(
			prisma.conversationNote.createMany({
				data: newNotes.map((note) => ({
					content: note.trim(),
					conversationId,
				})),
			})
		);
	}
	return newNotes;
}
