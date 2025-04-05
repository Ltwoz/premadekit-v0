import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from "@/components/root-provider";

const dmSans = DM_Sans({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "PremadeKit Starter",
  description: "A saas starter template for Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${spaceGrotesk.variable} antialiased`}
      >
        <RootProvider>{children}</RootProvider>
        
        <Toaster />
      </body>
    </html>
  );
}
