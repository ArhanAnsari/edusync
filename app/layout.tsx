import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import LiveChat from "@/components/LiveChat";
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "EduSync - Offline-First Learning Platform",
    template: "%s | EduSync"
  },
  description: "Access education anywhere, anytime with offline-first collaborative learning. Sync automatically, work offline, and collaborate in real-time.",
  keywords: ["education", "learning platform", "offline learning", "collaborative learning", "edtech", "online education", "LMS"],
  authors: [{ name: "Arhan Ansari", url: "https://arhanansari.me" }],
  creator: "Arhan Ansari",
  publisher: "EduSync",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edusync.appwrite.network",
    title: "EduSync - Offline-First Learning Platform",
    description: "Access education anywhere, anytime with offline-first collaborative learning",
    siteName: "EduSync",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "EduSync - Offline-First Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSync - Offline-First Learning Platform",
    description: "Access education anywhere, anytime with offline-first collaborative learning",
    creator: "@codewitharhan",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-gray-100`}>
        <Providers>
          {children}
          <CookieConsent />
          <LiveChat />
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}
