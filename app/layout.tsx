import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import LiveChatLoader from "@/components/LiveChatLoader";
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edusync.appwrite.network"),
  title: {
    default: "EduSync – AI-Powered Offline-First Learning Platform",
    template: "%s | EduSync",
  },
  description:
    "EduSync is a real-time, AI-powered, offline-first collaborative learning platform built with Appwrite and Gemini AI. Learn anywhere, sync automatically, and collaborate seamlessly.",
  keywords: [
    "EduSync",
    "AI learning platform",
    "Appwrite Hacktoberfest",
    "offline learning",
    "collaborative education",
    "real-time classroom",
    "Next.js project",
    "edtech innovation",
    "LMS platform",
    "Gemini AI",
  ],
  authors: [
    { name: "Arhan Ansari", url: "https://arhanansari.me" },
  ],
  creator: "Arhan Ansari",
  publisher: "EduSync by Arhan Ansari (CodeWithArhan)",
  manifest: "/site.webmanifest",
  category: "Education",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edusync.appwrite.network",
    siteName: "EduSync",
    title: "EduSync – AI-Powered Offline-First Learning Platform",
    description:
      "Learn anywhere, anytime with EduSync — an offline-first collaborative learning platform powered by Appwrite and Gemini AI.",
    images: [
      {
        url: "https://edusync.appwrite.network/logo.png",
        width: 1200,
        height: 630,
        alt: "EduSync – AI-Powered Offline-First Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codewitharhan",
    creator: "@codewitharhan",
    title: "EduSync – AI-Powered Offline-First Learning Platform",
    description:
      "Access education anywhere, anytime with EduSync — a collaborative platform built for real-time and offline learning.",
    images: ["https://edusync.appwrite.network/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://edusync.appwrite.network",
    languages: {
      "en-US": "https://edusync.appwrite.network",
    },
  },
  verification: {
    google: "zyojXIJ6aqb5QJzKv8szkobvKQ7F-8rm3bB7O54czX0",
    yandex: "0c083ce3826e4fb0",
    bing: "C7A7D2B41A5046F6A27F5C3BB5E33C65",
  },
  appLinks: {
    web: {
      url: "https://edusync.appwrite.network",
      should_fallback: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-gray-100`}>
        <Providers>
          {children}
          <CookieConsent />
          <LiveChatLoader />
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}
