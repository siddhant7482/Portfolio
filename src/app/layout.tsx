import type { Metadata } from "next";
import { Permanent_Marker, Caveat, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--nf-marker" });
const hand = Caveat({ subsets: ["latin"], variable: "--nf-hand" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--nf-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--nf-mono" });

export const metadata: Metadata = {
  title: "Sid · Siddhant Bhasin",
  description: "Software Engineer (AI/ML, LLM systems). Delhi to Newcastle, one stop at a time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${marker.variable} ${hand.variable} ${grotesk.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
