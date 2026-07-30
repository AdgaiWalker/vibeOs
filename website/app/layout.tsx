import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Agency-Craft · 把模糊变成具体",
    description:
      "Vibe 2.0 人机协作协议：AI 引导意图，人做决策；AI 执行，人用证据验收。",
    openGraph: {
      title: "Agency-Craft · 让人说清楚，让 AI 做得到",
      description:
        "一套把模糊感觉变成清晰选择、可靠工作流与可复用能力的人机协作协议。",
      images: [`${origin}/og.png`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Agency-Craft · 把模糊变成具体",
      description: "AI 引导，人决策；AI 执行，人验收。",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
