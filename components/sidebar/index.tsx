"use client";
import { useClerk } from "@clerk/nextjs";
import {
  IconApiApp,
  IconBrandGithubFilled,
  IconBrandX,
  IconCards,
  IconChevronRight,
  IconHash,
  IconHeartFilled,
  IconMenu2,
  IconSun,
} from "@tabler/icons-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";

import { SidebarDrawer } from "@/components/sidebar/drawer";
import { useInfo, useTags } from "@/components/sidebar/hook";
import { useMomentsUIStateStore } from "@/components/store";
import { Button } from "@/components/ui/Button";
import { FeatureFlagPopover } from "../feature-progress";
import { NeedAuthComponentWrapper } from "../need-auth-component-wrapper";

export const Sidebar = () => {
  const { isSidebarOpenInStore, setIsSidebarOpen } = useMomentsUIStateStore(
    (s) => {
      return {
        isSidebarOpenInStore: s.isSidebarOpen,
        setIsSidebarOpen: s.setIsSidebarOpen,
      };
    }
  );
  const pathname = usePathname();
  const isHomePage = pathname === "/notes";
  const isSidebarOpen = isHomePage ? isSidebarOpenInStore : true;
  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "fit-content" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            exit={{ width: 0 }}
            className={clsx(
              "sticky left-0 top-0 z-30 hidden h-screen overflow-hidden bg-black lg:block"
            )}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={"relative"}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className={clsx("absolute left-1 top-2 z-20")}
        >
          {isHomePage ? (
            <Button
              variant={"icon"}
              className={"hidden lg:flex"}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <IconChevronRight size={22} />
              ) : (
                <IconMenu2 size={22} />
              )}
            </Button>
          ) : (
            <></>
          )}
          <SidebarDrawer
            onOpenChange={(open) => {
              // setIsSidebarOpen(open);
            }}
            trigger={
              <Button variant={"icon"} className={"z-20 lg:hidden"}>
                <IconMenu2 size={22} />
              </Button>
            }
          >
            <SidebarContent />
          </SidebarDrawer>
        </motion.div>
      </div>
    </>
  );
};

const SidebarContent = () => {
  const { user } = useClerk();

  const contributionList = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const timeUserRegistered = user?.createdAt || new Date();
  const daysUserRegistered = Math.floor(
    (new Date().getTime() - new Date(timeUserRegistered).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const { data, mutate } = useInfo();
  const { data: tags } = useTags();
  const { totalNum, heatmapData } = data || {
    totalNum: 0,
    heatmapData: contributionList,
  };
  const tagsTotalNum = tags?.length || 0;

  return (
    <div className={"flex h-full w-[17rem] flex-col bg-zinc-50 p-2"}>
      <div className="flex-1">
        <div className="flex flex-col gap-5">
          <div className={"flex flex-col gap-4 p-3"}>
            <div className={"flex flex-row justify-between"}>
              <div className="flex flex-col text-xl font-bold text-zinc-500 hover:text-zinc-600">
                {totalNum}
                <p className={"text-xs"}>笔记</p>
              </div>
              <div className="flex flex-col text-xl font-bold text-zinc-500 hover:text-zinc-600">
                {tagsTotalNum}
                <p className={"text-xs"}>标签</p>
              </div>
              <div className="flex flex-col text-xl font-bold text-zinc-500 hover:text-zinc-600">
                {daysUserRegistered}
                <p className={"text-xs"}>天</p>
              </div>
            </div>
            <div className="flex w-full flex-row justify-between">
              {heatmapData?.map((week, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {week.map((day, j) => {
                    const durationCount = Math.floor(Math.random() * 3);

                    return (
                      <div
                        key={j}
                        className={clsx(
                          `h-3.5 w-3.5 rounded-sm transition-colors`,
                          {
                            "bg-zinc-100 ": day === 0,
                            "bg-green-600/20 ": day === 1,
                            "bg-green-700/60": day === 2,
                            "duration-1000": durationCount === 0,
                            "duration-500": durationCount === 1,
                            "duration-200": durationCount === 2,
                          }
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className={"flex flex-col gap-0.5"}>
            <NavItemListComponent />
          </div>
          <div>
            <div
              className={
                "flex flex-col gap-2 p-3 text-xs font-bold text-amber-600/60"
              }
            >
              标签
            </div>
            {tags?.map((tag, index) => (
              <TagItem title={tag} id={tag} active={false} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <div className="mx-auto flex max-w-md justify-around gap-6">
          <div
            className={
              "cursor-pointer text-zinc-300 transition-colors hover:text-zinc-600"
            }
          >
            <IconHeartFilled />
          </div>
          <Link href={"https://github.com"}>
            <div
              className={
                "cursor-pointer text-zinc-300 transition-colors hover:text-zinc-600"
              }
            >
              {" "}
              <IconBrandGithubFilled />
            </div>
          </Link>
          <Link href={"https://x.com"}>
            <div
              className={
                "cursor-pointer text-zinc-300 transition-colors hover:text-zinc-600"
              }
            >
              <IconBrandX />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const TagItem = ({
  id,
  title,
  active,
}: {
  title: string;
  id: string;
  active: boolean;
}) => {
  return (
    <FeatureFlagPopover milestoneNumber={3}>
      <Link
        href={`/notes?tag=${id}`}
        className={clsx(
          {
            "bg-green-500/90 text-white": active,
            "bg-gray-50 text-zinc-400": !active,
          },
          "flex h-9 w-full items-center justify-start gap-0.5 rounded-md px-3 text-sm font-semibold active:opacity-60 "
        )}
      >
        <IconHash size={"16"} />
        {title}
      </Link>
    </FeatureFlagPopover>
  );
};

const NavbarItem = ({
  id,
  title,
  icon,
  active,
  needAuth,
}: {
  title: string;
  id: string;
  icon: ReactNode;
  active: boolean;
  needAuth?: boolean;
}) => {
  if (needAuth) {
    return (
      <NeedAuthComponentWrapper url={`/${id}`}>
        <div
          className={clsx(
            {
              "bg-green-500/90 text-white": active,
              "bg-gray-50 text-black": !active,
              "cursor-pointer": true,
            },
            "flex h-9 w-full items-center justify-start gap-2 rounded-md px-3 text-sm font-semibold active:opacity-60 "
          )}
        >
          {icon}
          {title}
        </div>
      </NeedAuthComponentWrapper>
    );
  }
  return (
    <Link
      href={`/${id}`}
      className={clsx(
        {
          "bg-green-500/90 text-white": active,
          "bg-gray-50 text-black": !active,
        },
        "flex h-9 w-full items-center items-center justify-start gap-2 rounded-md px-3 text-sm font-semibold active:opacity-60 "
      )}
    >
      {icon}
      {title}
    </Link>
  );
};

export const NavItemListComponent = () => {
  const pathname = usePathname();
  return (
    <>
      <NavbarItem
        title={"全部笔记"}
        id={"notes"}
        icon={<IconCards />}
        active={pathname === "/notes"}
      />
      <NavbarItem
        title={"每日回顾"}
        id={"reviews"}
        icon={<IconSun />}
        active={pathname === "/reviews"}
      />
      <NavbarItem
        title={"API 接入"}
        id={"interface"}
        icon={<IconApiApp />}
        active={pathname === "/interface"}
        needAuth={true}
      />
      {/*<NavbarItem*/}
      {/*  title={"同步推特"}*/}
      {/*  id={"twitter"}*/}
      {/*  icon={<IconBrandTwitter />}*/}
      {/*  active={pathname === "/twitter"}*/}
      {/*/>*/}
    </>
  );
};
