"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  IconAlertTriangle,
  IconClockCog,
  IconCode,
  IconLock,
  IconLogs,
  IconMenu2,
  IconMoodPlus,
  IconPencilPlus,
  IconPointFilled,
  IconSearch,
  IconUserPlus,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

import type { getAPIKeysResponseType } from "@/app/api/apikey/route";
import { CommentMarkdown } from "@/components/CommentMarkdown";
import { ScrollAreaEnd } from "@/components/general/scrollarea-end";
import { TopMenuWrapper } from "@/components/topbar";
import { Button } from "@/components/ui/Button";
import { url } from "@/lib";
import { FeatureFlagPopover } from "@/components/feature-progress";
import { toast } from "sonner";
import { SupportPopover } from "@/components/support-popover";

export default function APIKeyPage() {
  const pathname = usePathname();

  return (
    <>
      <TopMenuWrapper>
        <div className={"flex flex-row items-center gap-2"}>
          <Button className={"invisible lg:hidden"} variant={"icon"}>
            <IconMenu2 size={22} />
          </Button>
          <div className="text-lg font-semibold">API</div>
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
        <UsageSection />
        <NoticeSection />
        <PublicAPIKeyUISection />
        <ScrollAreaEnd />
      </div>
    </>
  );
}

const useAPIKeys = () => {
  const { data, error, mutate } = useSWR<getAPIKeysResponseType>(
    "/api/apikey",
    (url: string) => fetch(url).then((res) => res.json())
  );

  return { data, error, mutate };
};

const PrivateAPIKeyUISection = () => {
  const { data } = useAPIKeys();
  const router = useRouter();
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { hostname } = window.location;
      setDomain(hostname);
    }
  }, [router]);

  let APIKey = "";
  if (data) {
    APIKey = `${process.env.NEXT_PUBLIC_URL ?? domain}/public/notes/${
      data.key
    }`;
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${APIKey}?source=flomoapp.com`);
    toast.success("复制成功", {
      position: "top-center",
    });
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4  rounded-sm bg-white px-4 py-5">
      <div className="flex w-full flex-col gap-2">
        <div className="text-base font-semibold">你的个人 API</div>
        <div className="flex w-full items-center rounded-md bg-zinc-200/70 px-3 py-1.5 text-sm font-normal">
          <div className="flex flex-1">
            {APIKey === "" ? "获取中..." : APIKey}
          </div>
          <Button className="ml-3" onClick={handleCopy}>
            复制
          </Button>
        </div>
        <ol className="text-xs leading-6 text-zinc-700">
          <li className="flex flex-row items-center gap-0.5">
            <IconPencilPlus size={12} /> 你可以通过此 API 来添加笔记。
          </li>
          <li className="flex flex-row items-center gap-0.5">
            <IconLock size={12} />
            添加的笔记默认为私有（仅自己可见）。
          </li>
          <li className="flex flex-row items-center gap-0.5">
            <IconMoodPlus size={12} /> 你可以在笔记详情页修改为公开。
          </li>
        </ol>
      </div>
    </div>
  );
};
const PublicAPIKeyUISection = () => {
  let APIKey = "您没有配置网站的 URL，请检查环境变量";
  const router = useRouter();
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { hostname } = window.location;
      setDomain(hostname);
    }
  }, [router]);

  if (process.env.NEXT_PUBLIC_URL) {
    APIKey = `${process.env.NEXT_PUBLIC_URL ?? domain}/public/notes`;
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(APIKey);
    toast.success("复制成功", {
      position: "top-center",
    });
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4  rounded-sm bg-white px-4 py-5">
      <div className="flex w-full flex-col gap-2">
        <div className="text-base font-semibold">将 Moments 嵌入你的博客</div>
        <div className="flex w-full items-center rounded-md bg-zinc-200/70 px-3 py-1.5 text-base font-normal">
          <div className="flex flex-1">{APIKey}</div>
          <Button className="ml-3" onClick={handleCopy}>
            复制
          </Button>
        </div>
        <ol className="text-xs leading-6 text-zinc-700">
          <li className="flex flex-row items-center gap-0.5">
            <IconLogs size={12} />
            你可以通过此API来获取所有公开的笔记，从而将 Moments
            嵌入到你自己的博客中。
          </li>
          <li className="flex flex-row items-center gap-0.5">
            <IconLock size={12} />
            私有笔记不会被返回。
          </li>
          <li className="flex flex-row items-center gap-0.5">
            <IconClockCog size={12} />
            限制每个终端每分钟请求30次。
          </li>
        </ol>
      </div>
    </div>
  );
};

const NoticeSection = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4  rounded-sm bg-white px-4 py-5">
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row items-center gap-1 text-base font-semibold">
          注意 <IconAlertTriangle size={20} />
        </div>
        <div className="text-sm">
          不要泄露你的个人 API，否则别人可以添加笔记到你的
          Moments。如果你发现任何人的 API 发生泄漏，请点击下方按钮联系我们。
        </div>
        <SupportPopover side="right" align="start">
          <div className="w-fit">
            <Button size="sm" variant="outline" className="w-fit">
              Moments 支持
            </Button>
          </div>
        </SupportPopover>
      </div>
    </div>
  );
};

const UsageSection = () => {
  const { data } = useAPIKeys();
  let APIKey = "";
  if (process.env.NEXT_PUBLIC_URL) {
    if (data) {
      APIKey = `${process.env.NEXT_PUBLIC_URL}/public/notes/${data.key}`;
    }
  } else {
    APIKey = "您没有配置网站的 URL，请检查环境变量";
  }

  const exampleCode = APIKey
    ? `
\`\`\`javascript
GET ${APIKey}
Content-type: application/json
{
    "content": "Hello, Moments!"
}
\`\`\`
`
    : "获取中...";
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4  rounded-sm bg-white px-4 py-5">
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-row items-center gap-1 text-base font-semibold">
          导入 Moments
          <IconPointFilled size={20} color="red" />
        </div>
        <div className="text-sm">
          Moments
          支持从微信读书、得到、RSS、Twitter、微博动态、饭否、锤子便签等平台导入笔记，导入工具正在适配中，点击按钮查看进度。
        </div>
        <FeatureFlagPopover side="right" align="start" milestoneNumber={5}>
          <div className="w-fit">
            <Button size="sm" variant="outline" className="w-fit">
              导入笔记
            </Button>
          </div>
        </FeatureFlagPopover>
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex flex-row items-center gap-1 text-sm font-semibold ">
            使用方法
            <IconCode size={16} />
          </div>
          <motion.div
            animate={{ height: APIKey === "" ? 20 : 168 }}
            transition={{ duration: 0.5 }}
            className="text-sm"
          >
            <CommentMarkdown>{exampleCode}</CommentMarkdown>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
