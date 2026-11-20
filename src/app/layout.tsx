import type { Metadata } from "next";
import { Permanent_Marker, Caveat, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--nf-marker" });
const hand = Caveat({ subsets: ["latin"], variable: "--nf-hand" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--nf-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--nf-mono" });

const title = "Sid · Siddhant Bhasin";
const description = "Software engineer building LLM systems. Delhi to Newcastle as a metro ride: scroll to drive the train, every station is something I've built.";

export const metadata: Metadata = {
  metadataBase: new URL("https://siddhantbhasin.me"),
  title,
  description,
  alternates: { canonical: "/" },
  // Link previews (LinkedIn, WhatsApp, Slack, X). The images are src/app/opengraph-image.jpg and twitter-image.jpg.
  openGraph: {
    type: "website",
    url: "https://siddhantbhasin.me",
    siteName: "Siddhant Bhasin",
    title,
    description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title, description },
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
