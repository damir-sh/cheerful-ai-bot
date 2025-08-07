import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Container, Stack } from "@mui/material";
import { TRPCProvider } from "@/lib/trpc/provider";
import { ToastProvider } from "@/components/toast-provider";

export const metadata: Metadata = {
	title: "Cheerful AI",
	description: "Get cheered up by a CheerfulAI",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body>
				<TRPCProvider>
					<AppRouterCacheProvider options={{ enableCssLayer: true }}>
						<ToastProvider>
							<ThemeProvider>
								<Stack
									height="100vh"
									justifyContent="center"
									alignItems="center"
									px={2}
								>
									<Container maxWidth="md" sx={{ height: "80vh" }}>
										{children}
									</Container>
								</Stack>
							</ThemeProvider>
						</ToastProvider>
					</AppRouterCacheProvider>
				</TRPCProvider>
			</body>
		</html>
	);
}
