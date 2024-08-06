import { ClerkLoading, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import { FeatureFlagPopover } from "../feature-progress";
import Link from "next/link";

export const NeedAuthComponentWrapper = ({
  children,
  url,
  milestoneNumber,
}: {
  children: ReactNode;
  url?: string;
  milestoneNumber?: number;
}) => {
  const wrapper = (children: ReactNode) => {
    if (url) {
      return <Link href={url}>{children}</Link>;
    }
    return children;
  };
  return (
    <>
      <SignedIn>
        {milestoneNumber ? (
          <FeatureFlagPopover milestoneNumber={milestoneNumber}>
            {children}
          </FeatureFlagPopover>
        ) : (
          wrapper(children)
        )}
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">{children}</SignInButton>
      </SignedOut>
      <ClerkLoading>{children}</ClerkLoading>
    </>
  );
};
