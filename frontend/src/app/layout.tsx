import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto_Condensed, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import "./globals.css";

const roboto = Roboto_Condensed({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "AnimeClip",
  description: "Generate and share your favorite anime clips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-roboto bg-background antialiased",
          roboto.variable,
          poppins.variable
        )}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
