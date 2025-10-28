import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { toast } from 'sonner';

// ------------------ DATABASE SCHEMA ------------------

interface EduSyncDB extends DBSchema {
  // 🧑‍🎓 Student-side stores
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

  // 🧑‍🏫 Teacher-side stores
  assignments: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      dueDate: string;
      createdBy: string;
      createdAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
  quizzes: {
    key: string;
    value: {
      id: string;
      title: string;
      questions: any[];
      createdBy: string;
      createdAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
  materials: {
    key: string;
    value: {
      id: string;
      title: string;
      fileUrl: string;
      createdBy: string;
      createdAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
  grading: {
    key: string;
    value: {
      id: string;
      submissionId: string;
      grade: number;
      feedback?: string;
      gradedBy: string;
      gradedAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
}

let dbInstance: IDBPDatabase<EduSyncDB> | null = null;

// ------------------ INIT DB ------------------

export async function initDB(): Promise<IDBPDatabase<EduSyncDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EduSyncDB>('edusync-db', 2, {
    upgrade(db, oldVersion) {
      // Student stores
      if (!db.objectStoreNames.contains('quizAttempts')) {
        const store = db.createObjectStore('quizAttempts', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('submissions')) {
        const store = db.createObjectStore('submissions', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }

      // Teacher stores
      if (!db.objectStoreNames.contains('assignments')) {
        const store = db.createObjectStore('assignments', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('quizzes')) {
        const store = db.createObjectStore('quizzes', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('materials')) {
        const store = db.createObjectStore('materials', { keyPath: 'id' });
        store.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('grading')) {
        const store = db.createObjectStore('grading', { keyPath: 'id' });
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

  const stores: (keyof EduSyncDB)[] = [
    // Student
    'quizAttempts',
    'submissions',
    // Teacher
    'assignments',
    'quizzes',
    'materials',
    'grading',
  ];

  let totalSynced = 0;
  let totalFailed = 0;

  // 🟢 Start sync indicator event
  window.dispatchEvent(new CustomEvent('sync-start'));

  for (const storeName of stores) {
    const pendingItems = await getPendingSyncItems(storeName);

    for (const item of pendingItems) {
      try {
        const apiRoute = `/api/sync/${storeName}`;
        const res = await fetch(apiRoute, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (res.ok) {
          await saveToOfflineDB(storeName, { ...item, syncStatus: 'synced' });
          totalSynced++;
        } else {
          totalFailed++;
          console.error(`Failed to sync ${storeName}:`, await res.text());
        }
      } catch (error) {
        totalFailed++;
        console.error(`Error syncing ${storeName}:`, error);
      }
    }
  }

  // 🔵 Complete sync indicator event
  window.dispatchEvent(
    new CustomEvent('sync-complete', {
      detail: { success: totalSynced, failed: totalFailed },
    })
  );

  if (totalSynced > 0) {
    toast.success(`✅ ${totalSynced} items synced successfully.`);
  }
  if (totalFailed > 0) {
    toast.error(`⚠️ ${totalFailed} items failed to sync.`);
  }
}

// ------------------ ONLINE LISTENER ------------------

export function setupOnlineListener(callback: () => void) {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

// ------------------ BACKGROUND SYNC ------------------

export function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register('edusync-background-sync').catch(console.error);
    });
  }
}