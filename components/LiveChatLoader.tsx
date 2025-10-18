/**
 * Client-Only LiveChat Loader
 * Ensures LiveChat only loads on client-side to prevent Turbopack SSR issues
 * Uses portal rendering for guaranteed visibility across all devices
 */
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

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

  // Don't render anything during SSR or before mounting
  if (!mounted) return null;

  // Render using portal for maximum compatibility and visibility
  return createPortal(
    <AISmartAssistant />,
    document.body
  );
}
