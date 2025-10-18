/**
 * Client-Only LiveChat Loader
 * Ensures LiveChat only loads on client-side to prevent Turbopack SSR issues
 */
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the AI Assistant only on client side
const AISmartAssistant = dynamic(
  () => import('@/components/AISmartAssistant'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function LiveChatLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) return null;

  return <AISmartAssistant />;
}
