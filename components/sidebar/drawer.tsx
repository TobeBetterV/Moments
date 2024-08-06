import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { IconUserPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";

function SidebarDrawer({
  trigger,
  onOpenChange,
  children,
}: {
  trigger: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Root direction={"left"} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild={true}>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 top-0 z-30 mr-24 flex flex-col">
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export { SidebarDrawer };
