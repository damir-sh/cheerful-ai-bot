"use client";

import { useEffect, useRef } from "react";

interface PaginationTriggerProps {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

/*
	Triggers the fetch of the next page when the user scrolls to the bottom of the page.
*/

export const PaginationTrigger = ({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: PaginationTriggerProps) => {
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!hasNextPage || isFetchingNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					fetchNextPage();
				}
			},
			{
				threshold: 0.1,
			}
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return <div ref={loadMoreRef} style={{ height: "1px" }} />;
};
