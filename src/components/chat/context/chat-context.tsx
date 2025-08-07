"use client";

import { createContext, useContext, PropsWithChildren } from "react";
import { useParams, useRouter } from "next/navigation";

interface ChatContextType {
	selectedConversationId: string | undefined;
	navigateToChat: (id: string | undefined) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/*
	Context that manages the chat selection (param based)
*/

export function ChatProvider({ children }: PropsWithChildren) {
	const params = useParams();
	const router = useRouter();

	const selectedConversationId = params.id as string | undefined;

	const navigateToChat = (id: string | undefined) => {
		if (id) {
			router.push(`/${id}`);
		} else {
			router.push("/");
		}
	};

	const value = {
		selectedConversationId,
		navigateToChat,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
}
