import { openDB } from 'idb';

export async function saveQuizProgress(userId: string, quizId: string, progress: any) {
  const db = await openDB('edusync-progress', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('quizProgress')) {
        db.createObjectStore('quizProgress', { keyPath: 'key' });
      }
    },
  });
  await db.put('quizProgress', { key: `${userId}-${quizId}`, ...progress });
}

export async function loadQuizProgress(userId: string, quizId: string) {
  const db = await openDB('edusync-progress', 1);
  return db.get('quizProgress', `${userId}-${quizId}`);
}

export async function clearQuizProgress(userId: string, quizId: string) {
  const db = await openDB('edusync-progress', 1);
  await db.delete('quizProgress', `${userId}-${quizId}`);
}