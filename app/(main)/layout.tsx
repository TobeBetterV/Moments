import { Sidebar } from "@/components/sidebar";
import { Toaster } from 'sonner'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"relative flex justify-center px-5 md:px-10 lg:px-0"}>
      <Toaster />
      <div
        className={
          "flex w-full max-w-screen-lg flex-row justify-center gap-2 lg:w-3/4"
        }
      >
        <Sidebar />
        <div className={"flex w-full flex-col lg:w-2/3"}>{children}</div>
      </div>
    </div>
  );
}
