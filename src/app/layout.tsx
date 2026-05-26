import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "凡人万物志",
  description: "凡人修仙传动漫百科，水墨丹青风，由道友共同维护的法宝、功法、人物与剧情资料库。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-full bg-[#0c0a08] text-[#e5ddd0] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <footer className="border-t border-[#c9a24d]/10 bg-[#0a0907] px-4 py-10 text-center text-sm">
          <div className="mx-auto max-w-7xl">
            <div className="ink-stroke mb-6" />
            <p className="font-ink text-base text-[#c9a24d]/80">
              凡人万物志 · 由道友共修
            </p>
            <p className="mt-2 text-[#8a7e65]">
              修仙路远，词条不灭；以众人所见，照一方天地。
            </p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
