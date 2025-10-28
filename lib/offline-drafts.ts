import { openDB } from 'idb';

export async function saveDraft(userId: string, assignmentId: string, content: string) {
  const db = await openDB('edusync-drafts', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('assignmentDrafts')) {
        db.createObjectStore('assignmentDrafts', { keyPath: 'key' });
      }
    },
  });
  await db.put('assignmentDrafts', { key: `${userId}-${assignmentId}`, content });
}

export async function loadDraft(userId: string, assignmentId: string) {
  const db = await openDB('edusync-drafts', 1);
  return db.get('assignmentDrafts', `${userId}-${assignmentId}`);
}

export async function clearDraft(userId: string, assignmentId: string) {
  const db = await openDB('edusync-drafts', 1);
  await db.delete('assignmentDrafts', `${userId}-${assignmentId}`);
}