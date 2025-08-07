import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
	await prisma.conversation.deleteMany();
}

main();
