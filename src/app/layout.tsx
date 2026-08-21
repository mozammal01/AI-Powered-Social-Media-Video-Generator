import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Video Generator | Professional Social Media Video Creation",
  description: "Create, edit, and render high-quality social media videos instantly using AI-powered automation and professional templates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans antialiased h-full min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
