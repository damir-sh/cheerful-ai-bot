import { TRPCError } from "@trpc/server";
import { Prisma } from "@/generated/prisma";

/*
	Formats Prisma errors to human readable errors
*/

export const formatServerError = (error: unknown): never => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case "P2002":
				throw new TRPCError({
					code: "CONFLICT",
					message:
						"This item already exists. Please try with different information.",
				});
			case "P2025":
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "The requested item could not be found.",
				});
			case "P2003":
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"This action cannot be completed due to related data constraints.",
				});
			case "P2014":
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "The provided ID is not valid.",
				});
			default:
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong with the database. Please try again.",
				});
		}
	}

	if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected database error occurred. Please try again.",
		});
	}

	if (error instanceof Prisma.PrismaClientValidationError) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"The information provided is not valid. Please check your input and try again.",
		});
	}

	// Fallback
	throw new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "Something unexpected happened. Please try again.",
	});
};
