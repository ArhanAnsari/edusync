'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
          <h1 className="text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Name and email address when you create an account</li>
                <li>Profile information and educational data</li>
                <li>Content you create, upload, or share on the platform</li>
                <li>Communications with us and other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. Data Storage and Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Offline-first architecture for data privacy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Your Rights</h2>
              <p className="text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
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
