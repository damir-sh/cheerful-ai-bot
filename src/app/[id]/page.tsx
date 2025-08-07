import { Chat } from "@/components/chat";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

/*
	- Chat component runs on client-side
	- This page runs on server-side
	- Could pre-load initial data here and pass to client
*/

export default async function ChatWithId({ params }: PageProps) {
	const { id } = await params;
	const conversation = await prisma.conversation.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
		},
	});

	if (!conversation) {
		redirect("/");
	}

	return <Chat />;
}
