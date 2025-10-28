'use client';

import { useEffect } from 'react';
import { setupOnlineListener, syncPendingData } from '@/lib/offline-sync';

export default function AutoSyncManager() {
  useEffect(() => {
    const unsubscribe = setupOnlineListener(async () => {
      console.log('🌐 Online — syncing offline data...');
      await syncPendingData();
    });

    return unsubscribe;
  }, []);

  return null;
}
