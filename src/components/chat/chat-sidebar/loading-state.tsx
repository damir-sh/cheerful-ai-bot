import { Typography, Divider, Stack, Skeleton, Box } from "@mui/material";

/*
	Loading state for chats sidebar
*/

export function LoadingState() {
	return (
		<Stack
			height="100%"
			direction="column"
			width="100%"
			sx={{ backgroundColor: "grey.900" }}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				p={2}
			>
				<Typography
					variant="h3"
					fontWeight={700}
					color="text.primary"
					fontSize={18}
				>
					Chats
				</Typography>
				<Skeleton variant="circular" width={40} height={40} />
			</Stack>
			<Divider />
			<Box sx={{ flex: 1, overflow: "auto", p: 0 }}>
				{Array.from({ length: 8 }).map((_, index) => (
					<Box key={index} sx={{ py: 1.5, px: 2 }}>
						<Stack direction="row" spacing={2} alignItems="center">
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="60%" height={20} />
								<Skeleton
									variant="text"
									width="80%"
									height={16}
									sx={{ mt: 0.5 }}
								/>
							</Box>
							<Skeleton variant="text" width={40} height={14} />
						</Stack>
					</Box>
				))}
			</Box>
		</Stack>
	);
}
