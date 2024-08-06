"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  IconMenu2,
  IconRefresh,
  IconSearch,
  IconUserPlus,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import React from "react";

import { Guestbook } from "@/components/guestbook/Guestbook";
import { useGuestbookFeeds } from "@/components/guestbook/hook";
import { TopMenuWrapper } from "@/components/topbar";
import { Button } from "@/components/ui/Button";
import { FEED_PAGE_SIZE } from "@/constants";
import { url } from "@/lib";
import { FeatureFlagPopover } from "@/components/feature-progress";

export default function BlogHomePage() {
  const pathname = usePathname();
  return (
    <>
      <TopMenuWrapper>
        <div className={"flex flex-row items-center gap-2"}>
          <Button className={"invisible"} variant={"icon"}>
            <IconMenu2 size={22} />
          </Button>
          <RefreshButton />
        </div>
        <div className={"flex flex-row items-center gap-2"}>
          <FeatureFlagPopover milestoneNumber={1}>
            <div>
              <Button variant={"icon"}>
                <IconSearch size={22} />
              </Button>
            </div>
          </FeatureFlagPopover>
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
      <div className="mt-4 flex items-center justify-center sm:mt-2">
        <Guestbook />
      </div>
    </>
  );
}

const RefreshButton = () => {
  const { mutate } = useGuestbookFeeds({ pageSize: FEED_PAGE_SIZE });
  const [isIconSpin, setIsIconSpin] = React.useState(false);
  const handleButtonClick = () => {
    setIsIconSpin(true);
    void mutate();
    setTimeout(() => {
      setIsIconSpin(false);
    }, 1500);
  };
  return (
    <Button variant={"icon"} onClick={handleButtonClick}>
      <IconRefresh className={isIconSpin ? "animate-spin" : ""} size={22} />
    </Button>
  );
};
