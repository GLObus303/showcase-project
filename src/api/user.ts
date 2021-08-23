import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { UserInfoType } from '../model/User';
import { RoomType } from '../model/Room';
import {
  transformSnapshotToData,
  transformSnapshotToList,
} from '../utils/apiTransform';

export const getUserInfo = async (uid: string) => {
  const db = getFirestore();
  const querySnapshot = await getDoc(doc(db, 'users', uid));

  return transformSnapshotToData<UserInfoType>(querySnapshot);
};

export const getUserList = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, '/users'));

  return transformSnapshotToList<UserInfoType>(querySnapshot);
};

export const updateUser = async (
  uid: string,
  { id, ...newData }: UserInfoType,
) => {
  const db = getFirestore();

  await updateDoc(doc(db, 'users', uid), newData);
};

export const deleteUser = async (uid: string) => {
  const db = getFirestore();

  await deleteDoc(doc(db, 'users', uid));

  const roomRef = collection(db, 'rooms');
  const roomQuery = query(roomRef, where('ownerId', '==', uid));
  const querySnapshot = await getDocs(roomQuery);

  const roomsToDelete = transformSnapshotToList<RoomType>(querySnapshot);

  const promises = roomsToDelete.map(
    async (toDelete) => await deleteDoc(doc(db, 'rooms', toDelete.id)),
  );

  await Promise.all(promises);
};
