import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { tryCatch } from "@/lib/try-catch";

import { generateAIResponse } from "@/server/llm";
import { systemPrompt } from "@/server/llm/system-prompt";
import { publicProcedure } from "@/server/trpc";

import { formatMessages } from "./format-messages";
import { formatServerError } from "../../utils";

import { generateAndSaveNotes } from "./generate-notes";
import { getExistingConversation } from "./get-existing-conversation";
import { trimMessagesToTokenLimit } from "./trim-messages";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

/*
	Procedure to send a message to the cheerful bot.
	- Checks notes from other conversations
	- Expands the system prompt with notes
	- Generates response from LLM
	- Saves message to DB
	- Saves new notes to DB (in the background)

	SCALABILITY:
	- This implementation will work fine for MOST conversations.
	
	- Issues may occur when the user has thousands of notes, which could clog up the system prompt.
	- Right now, I'm only grabbing up to 100 notes. We could work with a cursor based approach to get all notes.

	- There needs to be edge case handling for the system prompt length. 
	- E.g. we could summarize the notes into a bigger, single note and limit the token count on the system prompt.
	- As a next step, I would look into usign a vector database.
	- Further optimizations include using indexes on the notes in the database.
*/

export const sendMessageProcedure = publicProcedure
	.input(
		z.object({
			conversationId: z.string(),
			// Limit the message length to 1000 characters.
			// Avoid flooding the system prompt. LLM will hallucinate.
			content: z
				.string()
				.min(1, "Message cannot be empty")
				.max(
					1000,
					"Message is too long. Please keep it under 1000 characters."
				),
		})
	)
	.mutation(async ({ ctx, input }) => {
		// Grab the existing conversation
		const conversation = await getExistingConversation(input.conversationId);
		const conversationId = conversation.id;

		// Create the user message and save it in the DB.
		const { data: userMessage, error: userMessageError } = await tryCatch(
			ctx.prisma.conversationMessage.create({
				data: {
					content: input.content,
					originator: "USER",
					conversationId,
				},
			})
		);

		// Prisma error handling
		if (userMessageError) {
			formatServerError(userMessageError);
		}

		// Double check whether message was created.
		if (!userMessage) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create user message",
			});
		}

		// Grab up to 50 the notes from the DB.
		// This is to avoid flooding the system prompt with too many notes otherwise the LLM will start to hallucinate.
		// This is a very simplified approach to the problem, but should be good enough for now.
		// To make this scalable, we could go for a more sophisticated approach, such as using a vector database.
		/*
			Example of how we could store the note in a vectorized DB.
				{
					note: "Has social anxiety in crowds",
					tags: ["personality", "challenge"],
					timestamp: Date,
					embedding: [0.12, 0.93, ...]
				}
		*/
		const allNotesFromDb = await ctx.prisma.conversationNote.findMany({
			select: {
				content: true,
			},
			take: 50,
			orderBy: {
				createdAt: "desc",
			},
		});
		const existingNotes = allNotesFromDb.map((note) => note.content);

		// Format the messages in the OpenAI format.
		const messages = formatMessages(conversation.messages);
		messages.push({
			role: "user",
			content: userMessage.content,
		});

		// Trim the message history to the token limit.
		// Important to not exceed token limit and not run into big costs.
		const trimmedMessageHistory = trimMessagesToTokenLimit({
			systemPrompt: systemPrompt(existingNotes),
			messages,
		});

		const botResponseContent = await generateAIResponse({
			messages: trimmedMessageHistory as ChatCompletionMessageParam[],
			// Cap the response at 1000 tokens.
			// Should be enough for a sweet story (if the user asks for one).
			maxTokens: 1000,
		});

		const { data: botMessage, error: botMessageError } = await tryCatch(
			ctx.prisma.conversationMessage.create({
				data: {
					content: botResponseContent,
					originator: "BOT",
					conversationId,
				},
			})
		);

		if (botMessageError) {
			formatServerError(botMessageError);
		}

		// Double check whether messages were created
		if (!botMessage) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create bot message",
			});
		}

		// Update the conversation to the current date.
		// This will keep the conversation at the top of the list in the conversations list.
		await ctx.prisma.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				updatedAt: new Date(),
			},
		});

		// Generate the notes and save them in the DB.
		// This doesn't need to be awaited. It will just save new notes in the background.
		// The new notes will be available in the next prompt of the user.
		generateAndSaveNotes(messages, conversationId, existingNotes);

		return {
			conversationId,
			userMessage: userMessage,
			botMessage: botMessage,
		};
	});
