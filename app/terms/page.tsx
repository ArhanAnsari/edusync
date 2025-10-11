'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
          <h1 className="text-5xl font-bold mb-4 text-white">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using EduSync, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. Use License</h2>
              <p className="text-gray-300 mb-4">
                Permission is granted to temporarily use EduSync for personal, non-commercial 
                educational purposes. This license shall automatically terminate if you violate 
                any of these restrictions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must not share your account credentials</li>
                <li>You must notify us of any unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Acceptable Use</h2>
              <p className="text-gray-300 mb-4">
                You agree not to use EduSync to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Content Ownership</h2>
              <p className="text-gray-300 mb-4">
                You retain all rights to the content you create and upload. By uploading content, 
                you grant us a license to use, store, and display your content as necessary to 
                provide our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">6. Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account immediately, without prior notice, 
                for conduct that we believe violates these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                Questions about the Terms of Service should be sent to:
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
