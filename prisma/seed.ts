import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
	console.log("Starting to seed database...");

	// Generate 100 conversations
	for (
		let conversationIndex = 0;
		conversationIndex < 100;
		conversationIndex++
	) {
		console.log(`Creating conversation ${conversationIndex + 1}/100`);

		// Create a conversation
		const conversation = await prisma.conversation.create({
			data: {},
		});

		// Generate 50 messages for each conversation
		const messages = [];
		for (let messageIndex = 0; messageIndex < 50; messageIndex++) {
			const originator = messageIndex % 2 === 0 ? "USER" : "BOT";
			const content = (messageIndex + 1).toString();

			messages.push({
				content,
				originator,
				conversationId: conversation.id,
			});
		}

		// Batch create all messages for this conversation
		await prisma.conversationMessage.createMany({
			data: messages,
		});
	}

	console.log("Database seeding completed!");
	console.log(
		"Created 100 conversations with 50 messages each (5000 total messages)"
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
