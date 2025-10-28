'use client';

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { toast } from 'sonner';

// ✅ 1. Database Schema
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

// ✅ 2. Initialize IndexedDB
export async function initDB(): Promise<IDBPDatabase<EduSyncDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EduSyncDB>('edusync-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('materials')) {
        const materialStore = db.createObjectStore('materials', { keyPath: 'id' });
        materialStore.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('quizzes')) {
        const quizStore = db.createObjectStore('quizzes', { keyPath: 'id' });
        quizStore.createIndex('by-sync', 'syncStatus');
      }
      if (!db.objectStoreNames.contains('quizAttempts')) {
        const attemptStore = db.createObjectStore('quizAttempts', { keyPath: 'id' });
        attemptStore.createIndex('by-sync', 'syncStatus');
        attemptStore.createIndex('by-student', 'studentId');
      }
      if (!db.objectStoreNames.contains('submissions')) {
        const submissionStore = db.createObjectStore('submissions', { keyPath: 'id' });
        submissionStore.createIndex('by-sync', 'syncStatus');
        submissionStore.createIndex('by-student', 'studentId');
      }
    },
  });

  return dbInstance;
}

// ✅ 3. Generic CRUD operations
export async function saveToOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  data: EduSyncDB[T]['value']
) {
  const db = await initDB();
  await db.put(storeName, data);
}

export async function getFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  key: string
): Promise<EduSyncDB[T]['value'] | undefined> {
  const db = await initDB();
  return await db.get(storeName, key);
}

export async function getAllFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T
): Promise<EduSyncDB[T]['value'][]> {
  const db = await initDB();
  return await db.getAll(storeName);
}

export async function deleteFromOfflineDB<T extends keyof EduSyncDB>(
  storeName: T,
  key: string
) {
  const db = await initDB();
  await db.delete(storeName, key);
}

export async function getPendingSyncItems<T extends keyof EduSyncDB>(
  storeName: T
): Promise<EduSyncDB[T]['value'][]> {
  const db = await initDB();
  return await db.getAllFromIndex(storeName, 'by-sync', 'pending');
}

// ✅ 4. Network Utilities
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function setupOnlineListener(callback: () => void) {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

// ✅ 5. Offline Handling Helper (with Toasts)
export async function handleOfflineSave<T extends keyof EduSyncDB>(
  store: T,
  data: EduSyncDB[T]['value']
) {
  await saveToOfflineDB(store, { ...data, syncStatus: 'pending' });
  toast.info('📴 You are offline — data saved locally');
}

// ✅ 6. Auto Sync Function
export async function syncPendingData(
  syncFunction: (storeName: string, item: any) => Promise<void>
) {
  if (!isOnline()) return;

  const stores: (keyof EduSyncDB)[] = ['quizAttempts', 'submissions'];
  let syncedCount = 0;

  for (const storeName of stores) {
    const pendingItems = await getPendingSyncItems(storeName);
    for (const item of pendingItems) {
      try {
        await syncFunction(storeName, item);
        await saveToOfflineDB(storeName, { ...item, syncStatus: 'synced' });
        syncedCount++;
      } catch (error) {
        console.error(`❌ Failed to sync ${storeName}:`, error);
      }
    }
  }

  if (syncedCount > 0) {
    toast.success(`✅ ${syncedCount} item${syncedCount > 1 ? 's' : ''} synced successfully!`);
  }
}
