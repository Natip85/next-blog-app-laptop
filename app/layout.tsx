import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Yarcone",
  description: "An always-free blog site",
  icons: { icon: "/sound-waves.png" },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          suppressHydrationWarning
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            inter.variable
          )}
        >
          <div>{children}</div>
        </body>
      </html>
    </SessionProvider>
  );
}
