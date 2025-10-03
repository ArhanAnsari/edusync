import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface EduSyncDB extends DBSchema {
  materials: {
    key: string;
    value: {
      id: string;
      title: string;
      content: string;
      fileUrl?: string;
      teacherId: string;
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
      teacherId: string;
      createdAt: string;
      syncStatus: 'synced' | 'pending' | 'offline';
    };
    indexes: { 'by-sync': 'syncStatus' };
  };
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
    indexes: { 'by-sync': 'syncStatus'; 'by-student': 'studentId' };
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
    indexes: { 'by-sync': 'syncStatus'; 'by-student': 'studentId' };
  };
}

let dbInstance: IDBPDatabase<EduSyncDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<EduSyncDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EduSyncDB>('edusync-db', 1, {
    upgrade(db) {
      // Materials store
      if (!db.objectStoreNames.contains('materials')) {
        const materialStore = db.createObjectStore('materials', { keyPath: 'id' });
        materialStore.createIndex('by-sync', 'syncStatus');
      }

      // Quizzes store
      if (!db.objectStoreNames.contains('quizzes')) {
        const quizStore = db.createObjectStore('quizzes', { keyPath: 'id' });
        quizStore.createIndex('by-sync', 'syncStatus');
      }

      // Quiz attempts store
      if (!db.objectStoreNames.contains('quizAttempts')) {
        const attemptStore = db.createObjectStore('quizAttempts', { keyPath: 'id' });
        attemptStore.createIndex('by-sync', 'syncStatus');
        attemptStore.createIndex('by-student', 'studentId');
      }

      // Submissions store
      if (!db.objectStoreNames.contains('submissions')) {
        const submissionStore = db.createObjectStore('submissions', { keyPath: 'id' });
        submissionStore.createIndex('by-sync', 'syncStatus');
        submissionStore.createIndex('by-student', 'studentId');
      }
    },
  });

  return dbInstance;
}

// Generic CRUD operations
export async function saveToOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  data: EduSyncDB[T]['value']
) {
  const db = await initDB();
  await db.put(storeName as any, data as any);
}

export async function getFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  key: string
): Promise<EduSyncDB[T]['value'] | undefined> {
  const db = await initDB();
  return await db.get(storeName as any, key);
}

export async function getAllFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T
): Promise<EduSyncDB[T]['value'][]> {
  const db = await initDB();
  return await db.getAll(storeName as any);
}

export async function deleteFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  key: string
) {
  const db = await initDB();
  await db.delete(storeName as any, key);
}

export async function getPendingSyncItems<T extends keyof EduSyncDB>(
  storeName: T
): Promise<EduSyncDB[T]['value'][]> {
  const db = await initDB();
  const index = (db as any).getAllFromIndex(storeName, 'by-sync', 'pending');
  return await index;
}

// Network status management
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function setupOnlineListener(callback: () => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

// Sync functionality
export async function syncPendingData(
  syncFunction: (item: any) => Promise<void>
) {
  if (!isOnline()) return;

  const stores: (keyof EduSyncDB)[] = ['quizAttempts', 'submissions'];

  for (const storeName of stores) {
    const pendingItems = await getPendingSyncItems(storeName);

    for (const item of pendingItems) {
      try {
        await syncFunction(item);
        // Update sync status
        await saveToOfflineDB(storeName, { ...item, syncStatus: 'synced' });
      } catch (error) {
        console.error(`Failed to sync ${storeName}:`, error);
      }
    }
  }
}
