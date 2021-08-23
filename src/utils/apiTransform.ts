import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';

export const transformSnapshotToList = <T>(
  snapshot: QuerySnapshot<DocumentData>,
): T[] => {
  const data: any[] = [];

  snapshot?.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

  return data;
};

export const transformSnapshotToData = <T>(
  document: DocumentSnapshot<DocumentData>,
) => ({ id: document.id, ...document.data() } as unknown as T);
