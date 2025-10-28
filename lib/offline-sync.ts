import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { toast } from 'sonner';

interface EduSyncDB extends DBSchema {
  quizAttempts: {
    key: string;
    value: {
      id: string;
      quizId: string;
      studentId: string;
      answers: any[];
      score: number;
      completedAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
  submissions: {
    key: string;
    value: {
      id: string;
      assignmentId: string;
      studentId: string;
      content: string;
      fileUrl?: string;
      submittedAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
}

let dbInstance: IDBPDatabase<EduSyncDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<EduSyncDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EduSyncDB>('edusync-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('quizAttempts')) {
        const store = db.createObjectStore('quizAttempts', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('submissions')) {
        const store = db.createObjectStore('submissions', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
    },
  });

  return dbInstance;
}

// ------------------ CRUD OPERATIONS ------------------

export async function saveToOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  data: EduSyncDB[T]['value']
) {
  const db = await initDB();
  await db.put(storeName as any, data as any);
}

export async function getPendingSyncItems<T extends keyof EduSyncDB>(
  storeName: T
): Promise<EduSyncDB[T]['value'][]> {
  const db = await initDB();
  return await db.getAllFromIndex(storeName as any, 'by-sync', 'pending');
}

export async function updateSyncStatus<T extends keyof EduSyncDB>(
  storeName: T,
  id: string,
  status: 'synced' | 'pending' | 'offline'
) {
  const db = await initDB();
  const item = await db.get(storeName as any, id);
  if (item) {
    await db.put(storeName as any, { ...item, syncStatus: status });
  }
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// ------------------ OFFLINE HANDLERS ------------------

export async function handleOfflineSave<T extends keyof EduSyncDB>(
  storeName: T,
  data: EduSyncDB[T]['value']
) {
  data.syncStatus = 'pending';
  await saveToOfflineDB(storeName, data);

  toast.info("You're offline. Data saved locally — will sync when online.", {
    description: `Saved ${storeName} offline.`,
  });
}

// ------------------ SYNC LOGIC ------------------

export async function syncPendingData() {
  if (!isOnline()) return;

  toast.message('Syncing offline data...', {
    description: 'Please wait while we update your data.',
  });

  const stores: (keyof EduSyncDB)[] = ['quizAttempts', 'submissions'];

  for (const store of stores) {
    const pendingItems = await getPendingSyncItems(store);

    for (const item of pendingItems) {
      try {
        const response = await fetch(`/api/sync/${store}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          await updateSyncStatus(store, item.id, 'synced');
          toast.success(`✅ Synced ${store} successfully.`);
        } else {
          throw new Error('Failed to sync.');
        }
      } catch (err) {
        console.error(`[SYNC] Failed for ${store}:`, err);
      }
    }
  }

  toast.success('✅ All offline data synced!');
}

// ------------------ ONLINE LISTENER ------------------

export function setupOnlineListener(callback: () => void) {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}
