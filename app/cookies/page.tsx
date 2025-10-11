'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-white">Cookie Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">What Are Cookies?</h2>
              <p className="text-gray-300 mb-4">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
                  <p className="text-gray-300">
                    These cookies are necessary for the website to function properly. They enable 
                    basic features like page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Functional Cookies</h3>
                  <p className="text-gray-300">
                    These cookies enable enhanced functionality and personalization, such as 
                    remembering your login details and language preferences.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Cookies</h3>
                  <p className="text-gray-300">
                    These cookies help us understand how visitors interact with our website by 
                    collecting and reporting information anonymously.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Managing Cookies</h2>
              <p className="text-gray-300 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Delete cookies: You can delete cookies already stored on your device</li>
                <li>Third-party tools: Use privacy tools to manage tracking cookies</li>
              </ul>
              <p className="text-gray-300">
                Please note that disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <p className="text-blue-400">arhanansari2009@gmail.com</p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
