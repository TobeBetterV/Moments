"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="h-screen">
      <div className="pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-5">
        <motion.h1
          className="pointer-events-none select-none font-bold text-zinc-600"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          页面找不到了
        </motion.h1>
        <Link
          href="/"
          className="pointer-events-auto select-none text-xl font-bold text-white mix-blend-difference hover:underline"
        >
          返回主页
        </Link>
      </div>
    </main>
  );
}
