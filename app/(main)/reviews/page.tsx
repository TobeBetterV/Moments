"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCopy,
  IconDownload,
  IconHeartFilled,
  IconMenu2,
  IconSearch,
  IconUserPlus,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { random } from "lodash-es";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CommentMarkdown } from "@/components/CommentMarkdown";
import { useGuestbookFeeds } from "@/components/guestbook/hook";
import { TopMenuWrapper } from "@/components/topbar";
import { Button } from "@/components/ui/Button";
import { FEED_PAGE_SIZE } from "@/constants";
import { url } from "@/lib";
import { FeatureFlagPopover } from "@/components/feature-progress";

export default function DailyReviewPage() {
  const pathname = usePathname();

  return (
    <>
      <TopMenuWrapper>
        <div className={"flex flex-row items-center gap-2"}>
          <Button className={"invisible lg:hidden"} variant={"icon"}>
            <IconMenu2 size={22} />
          </Button>
          <div className="text-lg font-semibold">每日回顾</div>
        </div>
        <div className={"flex flex-row items-center gap-2"}>
          <Button variant={"icon"}>
            <IconSearch size={22} />
          </Button>
          <SignedOut>
            <SignInButton mode="modal" redirectUrl={url(pathname).href}>
              <Button variant={"icon"}>
                <IconUserPlus size={20} />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </TopMenuWrapper>
      <div className="mt-4 flex flex-col items-center justify-center gap-6 sm:mt-2">
        <PrivateAPIKeyUISection />
      </div>
    </>
  );
}

const PrivateAPIKeyUISection = () => {
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
  const [messageIndex, setMessageIndex] = useState(random(0, FEED_PAGE_SIZE));
  const message = feed?.flat()[messageIndex];

  const handleCopy = () => {
    void navigator.clipboard.writeText(message?.message || "");
  };
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 15) % 1000);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setMessageIndex((prev) => (prev + 1) % FEED_PAGE_SIZE);
  };
  const handlePrev = () => {
    setMessageIndex((prev) => (prev - 1 + FEED_PAGE_SIZE) % FEED_PAGE_SIZE);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-sm bg-white px-4 py-5">
      <motion.div
        initial={{
          backgroundImage: `linear-gradient( ${rotation}deg, #90F7EC 10%, #32CCBC 100%)`,
        }}
        animate={{
          backgroundImage: `linear-gradient( ${rotation}deg, #90F7EC 10%, #32CCBC 100%)`,
        }}
        transition={{
          duration: 0.5,
        }}
        className="flex w-full flex-col gap-4 rounded-md bg-gradient-to-br p-10"
      >
        <div className="relative flex h-[500px] w-full flex-col items-center justify-between rounded-md bg-white text-base font-normal">
          <time
            dateTime={message?.createdAt.toString()}
            className=" select-none text-lg font-semibold"
          >
            {dayjs(message?.createdAt).locale("zh-cn").format("YYYY/MM/DD")}
          </time>
          {message?.isUseMarkdown ? (
            <div className={"comment__message mb-2"}>
              <CommentMarkdown>{message.message}</CommentMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-xs font-medium text-gray-900 dark:text-gray-400 ">
              {message?.message}
            </div>
          )}
          <div>Moment</div>
          <div className="-mt-[500px] flex h-[500px] w-full items-center justify-center rounded-md bg-white/50 backdrop-blur-md"></div>
          <div className="absolute flex h-[500px] w-full items-center justify-center rounded-md bg-white/50">
            <SignedIn>
              <FeatureFlagPopover milestoneNumber={4}>
                <div>
                  <Button
                    className="w-fit"
                    variant="primary"
                    size="md"
                  >
                    开启回顾
                  </Button>
                </div>
              </FeatureFlagPopover>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  className="w-fit"
                  variant="primary"
                  size="md"
                  onClick={handleCopy}
                >
                  开启回顾
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </motion.div>
      <div className="flex gap-2 ">
        <Button
          className="w-fit bg-slate-50"
          variant="secondary-icon"
          size="sm"
          onClick={handleCopy}
        >
          <IconCopy size={20} />
        </Button>
        <Button
          className="w-fit bg-slate-50"
          variant="secondary-icon"
          onClick={handlePrev}
          size="sm"
        >
          <IconArrowLeft size={20} />
        </Button>
        <Button
          className="w-fit bg-slate-50"
          variant="secondary-icon"
          onClick={handleNext}
          size="sm"
        >
          <IconArrowRight size={20} />
        </Button>
        <Button
          className="w-fit bg-slate-50"
          variant="secondary-icon"
          size="sm"
        >
          <IconDownload size={20} />
        </Button>
      </div>
    </div>
  );
};
