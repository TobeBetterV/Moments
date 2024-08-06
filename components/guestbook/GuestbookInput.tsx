import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import {
  IconBrandTwitter,
  IconBrandTwitterFilled,
  IconEye,
  IconMarkdown,
  IconSend2,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { uniq } from "lodash-es";
import { usePathname } from "next/navigation";
import React from "react";
import AutosizeInput from "react-input-autosize";
import { useReward } from "react-rewards";
import TextareaAutosize from "react-textarea-autosize";

import { CommentMarkdown } from "@/components/CommentMarkdown";
import { useGuestbookFeeds } from "@/components/guestbook/hook";
import { ElegantTooltip } from "@/components/ui/Tooltip";
import { FEED_PAGE_SIZE, MAX_MESSAGE_LENGTH } from "@/constants";
import { type GuestbookDto } from "@/db/dto/guestbook.dto";
import { url } from "@/lib";
import { clsxm } from "@/utils/clsxm";
import { FeatureFlagPopover } from "../feature-progress";

const REWARDS_ID = "notes-rewards";
// 可以打开，但是已发送的消息显示有点问题，原因是为了保持一致性，在外侧对font-weight、font-size等属性进行了设置，Markdown会转化为HTMl的<b>、<h1>标签，样式会被外侧覆盖。

export function GuestbookInput() {
  const { user } = useUser();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = React.useState("");
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [isUseMarkdown, setIsUseMarkdown] = React.useState(false);
  const [inputTags, setInputTags] = React.useState<string[]>([]);
  const [isUseSyncTwitter, setIsUseSyncTwitter] = React.useState(false);
  const [inputKey, setInputKey] = React.useState<number>(1);
  const [isAddGustbookLoading, setIsAddGustbookLoading] = React.useState(false);
  const { reward } = useReward(REWARDS_ID, "balloons", {
    position: "absolute",
    elementCount: 30,
  });
  const pathname = usePathname();
  const isMessageValid =
    message.length > 0 && message.length <= MAX_MESSAGE_LENGTH;
  const { mutate } = useGuestbookFeeds({ pageSize: FEED_PAGE_SIZE });

  const onClickSend = async () => {
    if (isAddGustbookLoading || !isMessageValid || !user) {
      return;
    }
    setIsAddGustbookLoading(true);

    await mutate(
      async (data) => {
        const res = await fetch("/api/guestbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            tags: inputTags,
            isUseMarkdown: isUseMarkdown,
          }),
        });
        if (res) {
          setIsAddGustbookLoading(false);
          setMessage("");
          setInputTags([]);
          setInputKey((prev) => prev + 1);
          setIsPreviewing(false);
          reward();
        }
        const responseData: GuestbookDto = await res.json();
        return [[responseData], ...(data ?? [])];
      },
      {
        // optimisticData: (data) => [[optimisticData], ...(data ?? [])],
        rollbackOnError: true,
        revalidate: false,
      }
    );

    // signGuestbook();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      void onClickSend();
    }
  };

  return (
    <div
      className={clsxm(
        "group relative flex w-full rounded-lg bg-gradient-to-b from-zinc-50/50 to-white/70 p-4 pb-6 shadow-base ring-2 ring-zinc-200/30 transition-opacity [--spotlight-color:rgb(236_252_203_/_0.25)] dark:from-zinc-900/70 dark:to-zinc-800/60 dark:shadow-zinc-700/10 dark:ring-zinc-700/30 dark:[--spotlight-color:rgb(217_249_157_/_0.04)] md:p-4",
        isAddGustbookLoading && "pointer-events-none opacity-50"
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="z-10 flex-1 shrink-0">
        <div className={"relative flex flex-col"}>
          {isPreviewing ? (
            <div
              className="comment__message min-h-[72px] flex-1 shrink-0 px-2 py-1 text-sm text-zinc-800 dark:text-zinc-200"
              key="preview"
            >
              <CommentMarkdown>{message}</CommentMarkdown>
            </div>
          ) : (
            <TextareaAutosize
              ref={textareaRef}
              className={
                "block w-full shrink-0 resize-none border-0 bg-transparent p-0 text-sm text-xs font-medium leading-6 text-zinc-800 placeholder-zinc-400 outline-none transition-[height] will-change-[height] focus:outline-none focus:ring-0 dark:text-zinc-200 dark:placeholder-zinc-500"
              }
              value={message}
              minRows={3}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={"现在的想法是..."}
              onKeyDown={handleKeyDown}
              maxRows={8}
              autoFocus
            />
          )}
        </div>

        <footer className="-mb-1.5 mt-3 flex h-5 w-full items-center justify-between">
          <TagInputArea key={inputKey} setInputTags={setInputTags} />
          <AnimatePresence>
            <motion.aside
              key="send-button-wrapper"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{
                opacity: message.length > 0 ? 1 : 0.9,
                scale: 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className={clsxm("flex select-none items-center gap-3")}
            >
              <span
                className={clsxm(
                  "font-mono text-[10px]",
                  message.length > MAX_MESSAGE_LENGTH
                    ? "text-red-500"
                    : "text-zinc-500"
                )}
              >
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
              {isUseMarkdown && (
                <ElegantTooltip
                  content={isPreviewing ? "关闭预览" : "预览一下"}
                >
                  <motion.button
                    className={clsxm("appearance-none rounded-sm")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    disabled={isAddGustbookLoading}
                    onClick={() => setIsPreviewing((prev) => !prev)}
                  >
                    <IconEye
                      className={clsxm("h-5 w-5 ", {
                        "text-zinc-500 hover:text-zinc-600": !isPreviewing,
                        "text-blue-600": isPreviewing,
                      })}
                      size={20}
                      stroke={isUseMarkdown ? 2 : 1.5}
                    />
                  </motion.button>
                </ElegantTooltip>
              )}
              <ElegantTooltip
                content={isUseMarkdown ? "关闭 Markdown" : "使用 Markdown"}
              >
                <motion.button
                  className={clsxm("appearance-none rounded-sm")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={isAddGustbookLoading}
                  onClick={() => {
                    setIsUseMarkdown((prev) => !prev);
                    setIsPreviewing(false);
                  }}
                >
                  <IconMarkdown
                    className={clsxm("h-5 w-5 ", {
                      "text-zinc-500 hover:text-zinc-600": !isUseMarkdown,
                      "text-blue-600": isUseMarkdown,
                    })}
                    size={20}
                    stroke={isUseMarkdown ? 2 : 1.5}
                  />
                </motion.button>
              </ElegantTooltip>
              <FeatureFlagPopover milestoneNumber={6}>
                <div className="h-5 w-5">
                  <ElegantTooltip content={"同步 Twitter"}>
                    <motion.button
                      className={clsxm("appearance-none rounded-sm")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isAddGustbookLoading}
                    >
                      <IconBrandTwitter
                        className="h-5 w-5 text-zinc-500 hover:text-zinc-600"
                        size={20}
                      />
                    </motion.button>
                  </ElegantTooltip>
                </div>
              </FeatureFlagPopover>
              <>
                <SignedIn>
                  <ElegantTooltip
                    content={isMessageValid ? "发送" : "请先输入"}
                  >
                    <motion.button
                      className="appearance-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={onClickSend}
                    >
                      <IconSend2
                        className="h-5 w-5 text-zinc-800 dark:text-zinc-200"
                        size={20}
                      />
                    </motion.button>
                  </ElegantTooltip>
                </SignedIn>
                {/*signOut已经包含因为网络原因加载失败的情况，但SignInButton不包括，所以SignInButton显示时是已经加载的状态，而ClerkLoading显示时是未加载的状态*/}
                <SignedOut>
                  <SignInButton mode="modal" redirectUrl={url(pathname).href}>
                    <motion.button
                      className="appearance-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                    >
                      <IconSend2
                        className="h-5 w-5 text-zinc-800 dark:text-zinc-200"
                        size={20}
                      />
                    </motion.button>
                  </SignInButton>
                  <ClerkLoading>
                    <ElegantTooltip content={"请先登陆"}>
                      <motion.button
                        className="appearance-none"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                      >
                        <IconSend2
                          className="h-5 w-5 text-zinc-800 dark:text-zinc-200"
                          size={20}
                        />
                      </motion.button>
                    </ElegantTooltip>
                  </ClerkLoading>
                </SignedOut>
              </>
            </motion.aside>
          </AnimatePresence>
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-1/2 select-none"
            id={REWARDS_ID}
          />
        </footer>
      </div>
    </div>
  );
}

export const TagInputArea = ({
  setInputTags,
  initialTags = [],
  inEditMode = false,
}: {
  setInputTags: (tags: string[]) => void;
  initialTags?: string[] | null;
  inEditMode?: boolean;
}) => {
  const [tagInputedLocal, setTagInputedLocal] = React.useState<string[]>(
    initialTags ?? []
  );
  const [tagIsInputing, setTagIsInputing] = React.useState<string>("");

  return (
    <div className="flex select-none items-center justify-start gap-2">
      <div className="group/input flex items-center justify-start gap-0.5 rounded bg-gray-100 transition-colors hover:bg-gray-200/80">
        <div className="px-1 text-[12px] font-normal text-zinc-500">#</div>
        <AutosizeInput
          minWidth={40}
          maxLength={20}
          placeholder={""}
          value={tagIsInputing}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setTagIsInputing(e.currentTarget.value);
          }}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            setInputTags([e.currentTarget.value, ...tagInputedLocal]);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && tagIsInputing.length > 0) {
              const tagInputedLocalTemp = uniq([
                e.currentTarget.value,
                ...tagInputedLocal,
              ]);
              setTagInputedLocal(tagInputedLocalTemp);
              setInputTags(tagInputedLocalTemp);
              setTagIsInputing("");
            }
          }}
          inputClassName={
            "bg-gray-100 group-hover/input:bg-gray-200/80 transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          }
          className={clsxm("flex h-full rounded-md pr-2 text-xs")}
        />
      </div>
      {tagInputedLocal.map((tag: string, index: number) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          key={index}
          className={
            "flex flex-row items-center justify-center rounded bg-blue-50 px-1 text-[12px] font-normal text-blue-500"
          }
        >
          #{tag}
          <button
            className={"ml-0.5 rounded-full"}
            onClick={() => {
              const tagInputedLocalTemp = tagInputedLocal.filter(
                (_, i) => i !== index
              );
              setTagInputedLocal(tagInputedLocalTemp);
            }}
          >
            <IconX size={10} />
          </button>
        </motion.div>
      ))}
    </div>
  );
};
