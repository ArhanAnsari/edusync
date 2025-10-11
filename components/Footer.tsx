'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import {
  FaGithub,
  FaYoutube,
  FaDiscord,
  FaGlobe,
  FaXTwitter,
  FaLinkedin,
} from "react-icons/fa6";

interface FooterProps {
  role?: 'student' | 'teacher' | 'guest';
}

export default function Footer({ role = 'guest' }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      setSubscribeStatus('success');
      setMessage('Thanks for subscribing! Check your email.');
      setEmail('');
      
      setTimeout(() => {
        setSubscribeStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error: any) {
      setSubscribeStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
      
      setTimeout(() => {
        setSubscribeStatus('idle');
        setMessage('');
      }, 3000);
    }
  };
  const getQuickLinks = () => {
    if (role === 'teacher') {
      return [
        { href: '/dashboard/teacher/materials', label: 'Materials' },
        { href: '/dashboard/teacher/quizzes', label: 'Quizzes' },
        { href: '/dashboard/teacher/assignments', label: 'Assignments' },
        { href: '/dashboard/teacher/grading', label: 'Grading' },
      ];
    } else if (role === 'student') {
      return [
        { href: '/dashboard/student/materials', label: 'Materials' },
        { href: '/dashboard/student/quizzes', label: 'Quizzes' },
        { href: '/dashboard/student/assignments', label: 'Assignments' },
      ];
    } else {
      return [
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Sign Up' },
        { href: '/docs', label: 'Documentation' },
        { href: '/about', label: 'About Us' },
      ];
    }
  };

  const quickLinks = getQuickLinks();

  const socialLinks = [
    { href: 'https://github.com/ArhanAnsari/edusync', icon: FaGithub, label: 'GitHub' },
    { href: 'https://x.com/codewitharhan', icon: FaXTwitter, label: 'Twitter' },
    { href: 'https://www.linkedin.com/in/arhan-ansari-687597353', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://www.youtube.com/@codewitharhan', icon: FaYoutube, label: 'YouTube' },
    { href: 'https://discord.com/invite/bwjCXVwS8k', icon: FaDiscord, label: 'Discord' },
    { href: 'https://codewitharhan.infinityfreeapp.com', icon: FaGlobe, label: 'Website' },
    { href: 'mailto:arhanansari2009@gmail.com', icon: Mail, label: 'Email' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ];

  const featureLinks = [
    { href: '/features/offline-sync', label: 'Offline Sync' },
    { href: '/features/collaboration', label: 'Collaboration' },
    { href: '/features/analytics', label: 'Analytics' },
    { href: '/features/integrations', label: 'Integrations' },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="EduSync Logo" width={40} height={40} />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduSync
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Offline-first collaborative learning platform that keeps education accessible even without internet connectivity.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4 text-sm sm:text-base">Features</h3>
            <ul className="space-y-2">
              {featureLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h3 className="font-semibold text-gray-100 mb-4 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/docs" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>

            <h3 className="font-semibold text-gray-100 mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 pb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest updates on features and education tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={subscribeStatus === 'loading'}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-sm ${subscribeStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} EduSync. All rights reserved.
              </p>
              <span className="hidden sm:inline">•</span>
              <p className="text-center">Version 1.0.0</p>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <a 
                href="https://arhanansari.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-400 hover:text-blue-500 transition-colors inline-flex items-center gap-1"
              >
                Arhan Ansari
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
