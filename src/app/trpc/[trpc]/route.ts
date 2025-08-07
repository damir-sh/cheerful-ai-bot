import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/trpc",
		req,
		router: appRouter,
		createContext: createTRPCContext,
		onError: ({ path, error }) => {
			console.error(
				`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
			);
		},
	});

export { handler as GET, handler as POST };
