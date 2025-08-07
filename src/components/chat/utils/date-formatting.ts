import { format, isToday, isThisWeek, isThisYear } from "date-fns";

export function formatConversationTime(date: string | Date): string {
	const messageDate = new Date(date);

	if (isToday(messageDate)) {
		return format(messageDate, "HH:mm");
	}

	if (isThisWeek(messageDate)) {
		return format(messageDate, "EEE");
	}

	if (isThisYear(messageDate)) {
		return format(messageDate, "MMM d");
	}

	return format(messageDate, "MMM d, yyyy");
}

export function formatMessageTime(date: string | Date): string {
	const messageDate = new Date(date);

	if (isToday(messageDate)) {
		return format(messageDate, "HH:mm");
	}

	return format(messageDate, "MMM d, HH:mm");
}
