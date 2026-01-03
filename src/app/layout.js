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

export const metadata = {
  // Clean Primary Name for Browser Tabs
  title: "Free AI Image Gen | Unlimited Art & No Login Required",

  // Compelling description for Google Search Results
  description: "Experience the best Free AI Image Gen studio. Create unlimited high-resolution AI art and cinematic photos with no registration or login required. High-speed generation for everyone.",

  // Core keywords for indexing
  keywords: [
    "Free AI Image Gen",
    "unlimited ai image generator",
    "no login ai art",
    "free ai photo creator",
    "anonymous ai generator",
    "no signup",
    "unlimited image generation"
  ],

  // Social Media & Sharing previews
  openGraph: {
    title: "Free AI Image Gen - 100% Free & Unlimited",
    description: "The cleanest AI art generator online. No accounts, no login , no signup, just pure creativity.",
    // url: "https://yourdomain.com", // Change to your actual URL
    siteName: "Free AI Image Gen",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Helps Google understand this is the primary source */}
        {/* <link rel="canonical" href="https://yourdomain.com" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}