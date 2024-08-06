"use client";

import "dayjs/locale/zh-cn";

import { IconLoader2 } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useInView } from "framer-motion";
import React, { useEffect } from "react";

import { MessageBlock } from "@/components/guestbook/GuessbookBlock";
import { useGuestbookFeeds } from "@/components/guestbook/hook";
import { Button } from "@/components/ui/Button";
import { FEED_PAGE_SIZE } from "@/constants";
import { ScrollAreaEnd } from "../general/scrollarea-end";

dayjs.extend(relativeTime);

export function GuestbookFeeds() {
  const {
    data: feed,
    isLoading,
    error,
    isValidating,
    isReachingEnd,
    size,
    setSize,
    mutate,
  } = useGuestbookFeeds({ pageSize: FEED_PAGE_SIZE });
  const isError = error != null;
  // const { messages } = useSnapshot(guestbookState);
  const feedListData = feed?.flat();
  const feedListDataLength = feedListData?.length;
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const isLoadMoreIntersecting = useInView(loadMoreRef);
  useEffect(() => {
    if (
      isLoadMoreIntersecting &&
      !isReachingEnd &&
      !isValidating &&
      !isLoading
    ) {
      void setSize((prev) => prev + 1);
    }
  }, [isLoadMoreIntersecting, isLoading, isReachingEnd, isValidating, setSize]);
  if (!feedListDataLength && !isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <div className="text-label-muted text-center">加载失败</div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 mt-6 flex w-full flex-col items-center justify-center gap-3">
      <div className="absolute inset-0 flex items-center" aria-hidden="true" />
      {feedListData?.map((message, idx) => {
        if (!message) return null;
        return (
        <MessageBlock
          key={message.id}
          refetch={mutate}
          message={message}
          idx={idx}
          length={feedListData.length}
        />
      )})}
      <div ref={loadMoreRef} className={"absolute bottom-0 mb-[50vh]"}></div>
      {!isValidating && !isReachingEnd && (
        <div className="flex items-center justify-center gap-x-1">
          <Button
            variant={"secondary"}
            onClick={async () => {
              await setSize((prev) => prev + 1);
            }}
          >
            Load More
          </Button>
        </div>
      )}
      {isReachingEnd && <ScrollAreaEnd />}
      {isValidating && (
        <div className="mt-6 h-6 w-6 animate-spin rounded-full text-zinc-400">
          <IconLoader2 size={24} />
        </div>
      )}
    </div>
  );
}
