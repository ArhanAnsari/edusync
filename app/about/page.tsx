'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Users, Target, Award, Heart } from 'lucide-react';

export default function AboutPage() {
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
            <Link href="/docs">
              <Button variant="ghost" className="text-gray-300">Docs</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            About EduSync
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to make quality education accessible to everyone, 
            regardless of internet connectivity.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              Education should never be limited by technology barriers. EduSync was born 
              from the vision of creating a learning platform that works seamlessly, whether 
              you're online or offline.
            </p>
            <p className="text-gray-300">
              We believe that every student deserves access to quality educational resources, 
              and every teacher should have the tools they need to inspire and educate, 
              no matter where they are.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-8 rounded-xl"
          >
            <Target className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-4 text-white">Our Vision</h3>
            <p className="text-gray-300">
              To create a world where education is truly accessible to everyone, 
              bridging the digital divide and empowering learners globally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Our Values</h2>
          <p className="text-gray-300 text-lg">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <value.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Built by Students, for Students</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            EduSync is developed by passionate developers who understand the challenges 
            of modern education.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl text-center"
        >
          <Image 
            src="/logo.png" 
            alt="Arhan Ansari" 
            width={100} 
            height={100}
            className="mx-auto mb-4 rounded-full"
          />
          <h3 className="text-2xl font-bold mb-2 text-white">Arhan Ansari</h3>
          <p className="text-blue-400 mb-4">Founder & Lead Developer</p>
          <p className="text-gray-300 mb-6">
            A passionate developer committed to making education accessible through technology.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="https://github.com/ArhanAnsari" target="_blank">
              <Button variant="outline">GitHub</Button>
            </Link>
            <Link href="https://arhanansari.me" target="_blank">
              <Button variant="outline">Portfolio</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Join Us on This Journey</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of the revolution in accessible education
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-12">
              Get Started Today
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const values = [
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Education should be available to everyone, everywhere, regardless of connectivity.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every feature, ensuring the best learning experience.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Building a supportive community of learners and educators working together.',
  },
];
