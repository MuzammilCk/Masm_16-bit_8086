import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MASM Studio - Modern Assembly Language IDE",
  description: "The revolutionary cloud IDE for MASM 16-bit 8086 assembly language with AI-powered teaching assistant",
  keywords: ["assembly", "8086", "masm", "ide", "education", "ai", "compiler", "debugger"],
  authors: [{ name: "MASM Studio Team" }],
  openGraph: {
    title: "MASM Studio",
    description: "Revolutionary Assembly Language IDE with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
