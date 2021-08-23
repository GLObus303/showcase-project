import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import {
  transformSnapshotToList,
  transformSnapshotToData,
} from '../utils/apiTransform';
import { NewRoomType, RoomType } from '../model/Room';
import { BASE_RATING_FILTER } from '../components/SliderFilter';

export const getRoomList = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, 'rooms'));

  return transformSnapshotToList<RoomType>(querySnapshot);
};

export const getOrderedRoomList = async ([min, max]: [
  number,
  number,
] = BASE_RATING_FILTER) => {
  const db = getFirestore();
  const roomRef = collection(db, 'rooms');

  const roomQuery = query(
    roomRef,
    where('rating', '>=', min),
    where('rating', '<=', max),
    orderBy('rating', 'desc'),
  );
  const querySnapshot = await getDocs(roomQuery);

  return transformSnapshotToList<RoomType>(querySnapshot);
};

export const getRoomListForOwner = async (uid: string) => {
  const db = getFirestore();
  const roomRef = collection(db, 'rooms');

  const roomQuery = query(roomRef, where('ownerId', '==', uid));
  const querySnapshot = await getDocs(roomQuery);

  return transformSnapshotToList<RoomType>(querySnapshot);
};

export const getRoom = async (uid: string) => {
  const db = getFirestore();
  const querySnapshot = await getDoc(doc(db, 'rooms', uid));

  return transformSnapshotToData<RoomType>(querySnapshot);
};

export const createRoom = async (newData: NewRoomType) => {
  const db = getFirestore();
  const newRoom = await addDoc(collection(db, 'rooms'), {
    ...newData,
    rating: 0,
    totalRating: 0,
  });

  return newRoom;
};

export const updateRoom = async (uid: string, { id, ...newData }: RoomType) => {
  const db = getFirestore();

  await updateDoc(doc(db, 'rooms', uid), newData);
};

export const putRoom = async (
  uid: string,
  { id, ...newData }: Partial<RoomType>,
) => {
  const db = getFirestore();

  await setDoc(doc(db, 'rooms', uid), newData, { merge: true });
};

export const deleteRoom = async (uid: string) => {
  const db = getFirestore();
  await deleteDoc(doc(db, 'rooms', uid));
};
