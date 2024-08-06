"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

import { RichLink } from "@/components/links/RichLink";

export function CommentMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, href }) => {
          const rel = !href?.startsWith("/")
            ? "noreferrer noopener"
            : undefined;
          return (
            <RichLink
              href={href ?? ""}
              rel={rel}
              className="font-bold text-zinc-800 hover:underline dark:text-zinc-100"
            >
              {children}
            </RichLink>
          );
        },
        p: ({ children }) => (
          <p className="flex text-xs font-medium">{children}</p>
        ),
        img: ({ src, alt }) => (
          <ImageZoom value={{ key: src ?? "", url: src ?? "" }}>
            <img
              src={src}
              alt={alt}
              className="mr-2 aspect-square h-20 max-w-full rounded-lg object-cover"
            />
          </ImageZoom>
        ),
        code(props) {
          const { children, className, node, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              showInlineLineNumbers={true}
              language={match?.[1] ?? "javascript"}
              wrapLines={true}
              wrapLongLines={true}
              style={oneLight}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
const ImageZoom = ({
  value,
  children,
}: {
  value: { key: string; url: string };
  children: React.ReactNode;
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  return (
    <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
      {isZoomed && (
        <div
          className="relative"
          style={{
            width: 500,
            height: 500,
          }}
        />
      )}

      <AnimatePresence>
        {!isZoomed && (
          <div>
            <motion.div className="relative" layoutId={`image_${value.key}`}>
              <Dialog.Trigger>{children}</Dialog.Trigger>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isZoomed && (
          <Dialog.Portal forceMount>
            <Dialog.Close className="fixed inset-0 z-50 flex h-screen w-screen cursor-zoom-out items-center justify-center">
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="absolute inset-0 bg-black/50"
                  initial={{ opacity: 0, backdropFilter: "blur(0)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0)" }}
                />
              </Dialog.Overlay>

              <Dialog.Content className="w-full overflow-hidden">
                <div className="relative flex aspect-[3/2] items-center justify-center">
                  <div className="max-w-8xl relative flex aspect-[3/2] w-full items-center">
                    <motion.div
                      layoutId={`image_${value.key}`}
                      className="absolute inset-0"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.5,
                      }}
                    >
                      <img
                        src={value.url}
                        className="mx-auto h-full overflow-hidden object-contain"
                        alt={""}
                      />
                    </motion.div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Close>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
