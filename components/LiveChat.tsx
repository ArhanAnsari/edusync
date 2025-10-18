/**
 * LiveChat Wrapper Component
 * Dynamically loads AISmartAssistant to prevent Turbopack chunk loading issues
 */
'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR chunk loading issues
const AISmartAssistant = dynamic(
  () => import('@/components/AISmartAssistant'),
  { 
    ssr: false,
    loading: () => null // No loading state needed for floating button
  }
);

export default function LiveChat() {
  return <AISmartAssistant />;
}

  