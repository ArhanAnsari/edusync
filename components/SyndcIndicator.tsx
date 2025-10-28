'use client';

import { useEffect, useState } from 'react';
import { Cloud, RefreshCcw, CloudOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  useEffect(() => {
    // Online/offline tracking
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for sync start/complete events
    const handleSyncStart = () => setIsSyncing(true);
    const handleSyncComplete = () => {
      setIsSyncing(false);
      setLastSynced(new Date());
    };

    window.addEventListener('sync-start', handleSyncStart);
    window.addEventListener('sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sync-start', handleSyncStart);
      window.removeEventListener('sync-complete', handleSyncComplete);
    };
  }, []);

  // Dynamic UI
  let icon, text, color;
  if (!isOnline) {
    icon = <CloudOff className="w-4 h-4 text-red-400" />;
    text = 'Offline';
    color = 'text-red-400';
  } else if (isSyncing) {
    icon = <RefreshCcw className="w-4 h-4 text-yellow-400 animate-spin" />;
    text = 'Syncing...';
    color = 'text-yellow-400';
  } else {
    icon = <Cloud className="w-4 h-4 text-green-400" />;
    text = 'Synced';
    color = 'text-green-400';
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 text-sm"
      >
        {icon}
        <span className={`${color} font-medium`}>{text}</span>
        {lastSynced && !isSyncing && isOnline && (
          <span className="text-xs text-gray-500">
            {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}