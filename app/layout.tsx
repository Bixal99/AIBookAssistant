import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Variable } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookBy",
  description:
    "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books using voice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "relative font-sans antialiased",
        ibmPlexSerif.variable,
        monaSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}
        <Navbar />
      </body>
    </html>
  );
}
