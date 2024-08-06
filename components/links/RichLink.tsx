"use client";

import { IconExternalLink } from "@tabler/icons-react";
import Link, { type LinkProps } from "next/link";
import React from "react";

import { clsxm } from "@/utils/clsxm";

type RichLinkProps = LinkProps &
  React.ComponentPropsWithoutRef<"a"> & {
    children: React.ReactNode;
  } & {
    favicon?: boolean;
  };
export const RichLink = React.forwardRef<HTMLAnchorElement, RichLinkProps>(
  ({ children, href, favicon = true, className, ...props }, ref) => {
    // if it's a relative link, use a fallback Link
    if (!href.startsWith("http")) {
      return (
        <Link href={href} className={className} ref={ref} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={clsxm(
          "inline-flex place-items-baseline items-baseline gap-0.5 pr-0.5 text-[0.95em] leading-none",
          className
        )}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
        <IconExternalLink
          size={11}
          className="inline-block translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  }
);
RichLink.displayName = "RichLink";
