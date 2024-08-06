import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import {
  IconDots,
  IconEye,
  IconMarkdown,
  IconSend2,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { type SWRInfiniteResponse } from "swr/infinite";

import { CommentMarkdown } from "@/components/CommentMarkdown";
import { TagInputArea } from "@/components/guestbook/GuestbookInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ElegantTooltip } from "@/components/ui/Tooltip";
import { MAX_MESSAGE_LENGTH } from "@/constants";
import { type GuestbookDto } from "@/db/dto/guestbook.dto";
import { url } from "@/lib";
import { clsxm } from "@/utils/clsxm";
import { parseDisplayName } from "@/utils/str";
type InfiniteKeyedMutator<T> = SWRInfiniteResponse<
  T extends (infer I)[] ? I : T
>["mutate"];
function Message({
  message,
  refetch,
  idx,
  length,
}: {
  message: GuestbookDto;
  refetch: InfiniteKeyedMutator<GuestbookDto[][]>;
  idx: number;
  length: number;
}) {
  const { user } = useClerk();
  const isSiteOwner = user?.publicMetadata.siteOwner;
  const isMessageOwner = user?.id === message.userId;
  const [isArchived, setIsArchived] = React.useState(message.isArchived);
  const [isInEditMode, setIsInEditMode] = React.useState(false);
  const [messageUserInput, setMessageUserInput] = React.useState(
    message.message
  );
  const handleDelete = () => {
    if (isMessageOwner || isSiteOwner) {
      void refetch(
        async (pages) => {
          const res = await fetch(`/api/guestbook/delete/${message.id}`, {
            method: "DELETE",
          });
          return pages?.map((page) => {
            return page?.filter((m) => m.id !== message.id);
          });
        },
        {
          optimisticData: (pages) => {
            if (!pages) {
              return [];
            }
            return pages?.map((page) => {
              return page?.filter((m) => m.id !== message.id);
            });
          },
          revalidate: false,
        }
      );
    } else {
      return;
    }
  };
  const handleArchive = async () => {
    if (user?.id !== message.userId) {
      return;
    }
    setIsArchived(!isArchived);
    const res = await fetch(
      `/api/guestbook/${isArchived ? "unarchive" : "archive"}/${message.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: message.id }),
      }
    );
    if (res.ok) {
      // setStorePopoverMessage(`${isArchived ? '取消隐藏' : '隐藏'}成功了`)
    } else {
      // setStorePopoverMessage(`${isArchived ? '取消隐藏' : '隐藏'}失败了`)
    }
    void refetch();
  };
  const handleCancelEdit = () => {
    setIsInEditMode(false);
  };
  const isDeleteAndArchiveDisabled = !isMessageOwner && !isSiteOwner;

  if (!message) {
    console.error("message is null");
    return null;
  }

  return (
    <div
      className={clsxm(
        "rounded-m group relative w-full rounded-lg bg-white p-4 transition-all hover:shadow-base",
        {
          "border border-gray-400 ": isInEditMode,
        }
      )}
    >
      <div className={"mb-2 flex w-full justify-between text-zinc-400"}>
        <div className={"flex flex-row gap-2"}>
          <time
            dateTime={message.createdAt.toString()}
            className=" select-none text-[12px] font-medium"
          >
            {dayjs(message.createdAt).locale("zh-cn").fromNow()}
          </time>
          {message.isPinned && (
            <div
              className={
                "rounded bg-blue-50 px-1 text-[12px] font-normal text-blue-500"
              }
            >
              # 置顶
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={"focus-visible:outline-none"}>
            <IconDots className={"cursor-pointer"} size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className={""}>
            <ElegantTooltip
              content={
                isDeleteAndArchiveDisabled
                  ? user
                    ? "您不能编辑别人的发帖"
                    : "您未登陆"
                  : ""
              }
              side={"right"}
            >
              <div>
                <DropdownMenuItem
                  onSelect={() => setIsInEditMode((prev) => !prev)}
                  disabled={!isMessageOwner && !isSiteOwner}
                >
                  {isInEditMode ? "取消编辑" : "编辑"}
                </DropdownMenuItem>
              </div>
            </ElegantTooltip>
            <ElegantTooltip
              content={
                isDeleteAndArchiveDisabled
                  ? user
                    ? "您不能隐藏别人的发帖"
                    : "您未登陆"
                  : ""
              }
              side={"right"}
            >
              <div>
                <DropdownMenuItem
                  onSelect={handleArchive}
                  disabled={!isMessageOwner && !isSiteOwner}
                >
                  {isArchived ? "取消隐藏" : "隐藏"}
                </DropdownMenuItem>
              </div>
            </ElegantTooltip>
            <ElegantTooltip
              content={
                isDeleteAndArchiveDisabled
                  ? user
                    ? "您不能删除别人的发帖"
                    : "您未登陆"
                  : ""
              }
              side={"right"}
            >
              <div>
                <DropdownMenuItem
                  onSelect={handleDelete}
                  disabled={!isMessageOwner && !isSiteOwner}
                  className={"text-red-500"}
                >
                  删除
                </DropdownMenuItem>
              </div>
            </ElegantTooltip>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isInEditMode ? (
        <MessageBlockContentInEditMode
          message={message}
          handleCancelEdit={handleCancelEdit}
          messageUserInput={messageUserInput}
          setMessageUserInput={setMessageUserInput}
        />
      ) : (
        <>
          {message.isUseMarkdown ? (
            <div className={"comment__message mb-2"}>
              <CommentMarkdown>{messageUserInput}</CommentMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-xs font-medium text-gray-900 dark:text-gray-400 ">
              {messageUserInput}
            </div>
          )}
          <MessageBlockFooter message={message} isArchived={isArchived} />
        </>
      )}
    </div>
  );
}

const MessageBlockContentInEditMode = ({
  message,
  handleCancelEdit,
  messageUserInput,
  setMessageUserInput,
}: {
  message: GuestbookDto;
  messageUserInput: string;
  setMessageUserInput: (value: string) => void;
  handleCancelEdit: () => void;
}) => {
  const { user } = useUser();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [isUseMarkdown, setIsUseMarkdown] = React.useState(false);
  const [inputTags, setInputTags] = React.useState<string[]>([]);
  const [inputKey, setInputKey] = React.useState<number>(1);
  const [isGustbookSubmitting, setIsGustbookSubmitting] = React.useState(false);
  const pathname = usePathname();

  const isMessageValid =
    messageUserInput.length > 0 &&
    messageUserInput.length <= MAX_MESSAGE_LENGTH;

  const onClickSend = async () => {
    if (isGustbookSubmitting || !isMessageValid || !user) {
      return;
    }
    setIsGustbookSubmitting(true);
    const res = await fetch(`/api/guestbook/edit/${message.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageUserInput,
        tags: inputTags,
        isUseMarkdown: isUseMarkdown,
      }),
    });
    setIsGustbookSubmitting(false);
    if (res.ok) {
      handleCancelEdit();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      await onClickSend();
    }
  };

  return (
    <>
      <div className={"relative flex flex-col"}>
        {isPreviewing ? (
          <div
            className="comment__message min-h-[72px] flex-1 shrink-0 px-2 py-1 text-sm text-zinc-800 dark:text-zinc-200"
            key="preview"
          >
            <CommentMarkdown>{messageUserInput}</CommentMarkdown>
          </div>
        ) : (
          <TextareaAutosize
            ref={textareaRef}
            className={
              "block w-full shrink-0 resize-none border-0 bg-transparent p-0 text-xs font-medium leading-6 text-zinc-800 placeholder-zinc-400 outline-none transition-[height] will-change-[height] focus:outline-none focus:ring-0 dark:text-zinc-200 dark:placeholder-zinc-500"
            }
            value={messageUserInput}
            minRows={3}
            onChange={(event) => setMessageUserInput(event.target.value)}
            placeholder={"现在的想法是..."}
            onKeyDown={handleKeyDown}
            maxRows={8}
            autoFocus
          />
        )}
      </div>
      <footer className="-mb-1.5 mt-3 flex h-5 w-full items-center justify-between">
        <TagInputArea
          initialTags={message.tags}
          inEditMode={true}
          setInputTags={setInputTags}
        />

        <AnimatePresence>
          <motion.aside
            key="send-button-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{
              opacity: messageUserInput.length > 0 ? 1 : 0.9,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className={clsxm("flex select-none items-center gap-3")}
          >
            <span
              className={clsxm(
                "font-mono text-[10px]",
                messageUserInput.length > MAX_MESSAGE_LENGTH
                  ? "text-red-500"
                  : "text-zinc-500"
              )}
            >
              {messageUserInput.length}/{MAX_MESSAGE_LENGTH}
            </span>
            {isUseMarkdown && (
              <ElegantTooltip content={isPreviewing ? "关闭预览" : "预览一下"}>
                <motion.button
                  className={clsxm("appearance-none rounded-sm")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={isGustbookSubmitting}
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
            {
              <ElegantTooltip
                content={isUseMarkdown ? "关闭 Markdown" : "使用 Markdown"}
              >
                <motion.button
                  className={clsxm("appearance-none rounded-sm")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={isGustbookSubmitting}
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
            }
            <>
              <SignedIn>
                <ElegantTooltip content={isMessageValid ? "发送" : "请先输入"}>
                  <motion.button
                    className={clsx("appearance-none", {
                      "bg-red": isGustbookSubmitting || !isMessageValid,
                    })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isGustbookSubmitting || !isMessageValid}
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
      </footer>
    </>
  );
};

const MessageBlockFooter = ({
  message,
  isArchived,
}: {
  message: GuestbookDto;
  isArchived: boolean;
}) => {
  const userDisplayName = parseDisplayName(message.userInfo);
  return (
    <div className={"mt-1 flex select-none items-center justify-start gap-2"}>
      <div
        className={clsx(
          "rounded bg-gray-100 px-1 text-[12px] font-normal text-zinc-700"
        )}
      >
        {`by ${userDisplayName}`}
      </div>
      {message.tags?.map((tag: string, index: number) => {
        return (
          <div
            key={index}
            className={
              "rounded bg-blue-50 px-1 text-[12px] font-normal text-blue-500"
            }
          >
            #{tag}
          </div>
        );
      })}
      <AnimatePresence>
        {isArchived && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={
              "rounded bg-blue-50 px-1 text-[12px] font-normal text-zinc-700"
            }
          >
            # 仅自己可见
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export const MessageBlock = React.memo(Message);
