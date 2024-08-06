"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import { type Middleware, SWRConfig, type SWRHook } from "swr";

import { GuestbookFeeds } from "./GuestbookFeeds";
import { GuestbookInput } from "./GuestbookInput";

const logger: Middleware = (useSWRNext: SWRHook) => {
  return function (key, fetcher, config) {
    // console.log("key:", key);
    return useSWRNext(key, fetcher, config);
  };
};

export function Guestbook() {
  return (
    <SWRConfig value={{ use: [logger] }}>
      <motion.section
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
        exit={{ opacity: 0 }}
        className="flex w-full flex-col"
      >
        <GuestbookInput />
        <GuestbookFeeds />
      </motion.section>
    </SWRConfig>
  );
}
