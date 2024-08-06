/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

import { clsxm } from "@/utils/clsxm";

const variantStyles = {
  primary:
    "bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300 dark:active:bg-zinc-300/70",
  secondary:
    "group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20",
  "secondary-icon":
    "text-zinc-500 aspect-square hover:bg-zinc-200/50 rounded-full",
  outline:
    "group bg-zinc-50/50 text-zinc-800 hover:bg-zinc-200/50 hover:text-zinc-900 active:bg-zinc-50 active:text-zinc-700 dark:bg-zinc-800 ring-1 ring-zinc-900/20 backdrop-blur dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:active:bg-zinc-800 dark:active:text-zinc-100/70",
  icon: "text-zinc-500 aspect-square hover:bg-zinc-200/50",
};

const sizeStyles = {
  sm: "px-2 text-xs leading-5",
  md: "px-3 text-sm leading-8",
  lg: "px-4 text-lg leading-10",
};

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};
type NativeLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type SharedProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
};
type ButtonProps = SharedProps & (NativeButtonProps | NativeLinkProps);
export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: ButtonProps) {
  const cn = clsxm(
    "inline-flex items-center gap-2 justify-center rounded-md outline-offset-2 transition active:transition-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return href ? (
    <Link href={href} className={cn} {...(props as any)} />
  ) : (
    <button className={cn} {...(props as any)} />
  );
}
