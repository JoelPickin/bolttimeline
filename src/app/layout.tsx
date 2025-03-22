import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "The World's Largest Hackathon | hackathon.dev",
  description: "Join the world's largest hackathon hosted by Bolt, with over $1 million in prizes and 100,000+ global participants. Experience the evolution of coding from punch cards to AI.",
  keywords: ["hackathon", "bolt.new", "coding", "programming", "ai", "development", "technology"],
  authors: [{ name: "Bolt.new" }],
  openGraph: {
    title: "The World's Largest Hackathon | hackathon.dev",
    description: "Join the world's largest hackathon hosted by Bolt, with over $1 million in prizes and 100,000+ global participants. Experience the evolution of coding from punch cards to AI.",
    url: "https://hackathon.dev",
    siteName: "The World's Largest Hackathon",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The World's Largest Hackathon",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The World's Largest Hackathon | hackathon.dev",
    description: "Join the world's largest hackathon hosted by Bolt, with over $1 million in prizes and 100,000+ global participants.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
