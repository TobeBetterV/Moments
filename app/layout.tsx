import "@/styles/globals.css";
import "@/styles/variables.css";
// import "@/styles/comment.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";

import { zhCN } from "@/lib/clerkLocalizations";
import { sansFont } from "@/lib/font";

export const metadata: Metadata = {
  title: "Moments",
  description: "笔记、摘录、思考",
  keywords: "笔记,摘录,思考",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
    title: "Moments",
    startupImage: "/icon.png",
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html
        lang="zh-CN"
        className={`${sansFont.variable} m-0 h-full overscroll-none p-0 font-sans antialiased`}
      >
        <body className="overscroll-none bg-zinc-50">{children}</body>
      </html>
    </ClerkProvider>
  );
}
