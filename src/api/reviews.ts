import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  OrderByDirection,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { NewReviewType, ReviewType } from '../model/Review';
import { transformSnapshotToList } from '../utils/apiTransform';
import { putRoom } from './rooms';
import { RoomType } from '../model/Room';

export const getReviewsForRoom = async (
  roomId: string,
  creationOrder: OrderByDirection = 'desc',
) => {
  const db = getFirestore();
  const reviewRef = collection(db, 'reviews');

  const reviewQuery = query(
    reviewRef,
    where('roomId', '==', roomId),
    orderBy('creationDate', creationOrder),
  );
  const querySnapshot = await getDocs(reviewQuery);

  return transformSnapshotToList<ReviewType>(querySnapshot);
};

export const getReviewsForOwner = async (roomList: RoomType[]) => {
  if (!roomList.length) {
    return null;
  }

  const roomIdList = roomList.map(({ id }) => id);

  const db = getFirestore();
  const reviewRef = collectionGroup(db, 'reviews');

  const reviewQuery = query(
    reviewRef,
    where('roomId', 'in', roomIdList),
    where('reply', '==', ''),
  );
  const querySnapshot = await getDocs(reviewQuery);

  return transformSnapshotToList<ReviewType>(querySnapshot);
};

export const getHighestReviewForRoom = async (roomId: string) => {
  const db = getFirestore();
  const reviewRef = collection(db, 'reviews');

  const reviewQuery = query(
    reviewRef,
    where('roomId', '==', roomId),
    orderBy('rating', 'desc'),
    orderBy('creationDate', 'desc'),
  );
  const querySnapshot = await getDocs(reviewQuery);

  return transformSnapshotToList<ReviewType>(querySnapshot);
};

export const getLowestReviewForRoom = async (roomId: string) => {
  const db = getFirestore();
  const reviewRef = collection(db, 'reviews');

  const reviewQuery = query(
    reviewRef,
    where('roomId', '==', roomId),
    orderBy('rating', 'asc'),
    orderBy('creationDate', 'desc'),
  );
  const querySnapshot = await getDocs(reviewQuery);

  return transformSnapshotToList<ReviewType>(querySnapshot);
};

export const addReviewForRoom = async ({
  roomId,
  totalRoomRating,
  numberOfReviews,
  data,
}: {
  roomId: string;
  totalRoomRating: number;
  numberOfReviews: number;
  data: NewReviewType;
}) => {
  const db = getFirestore();
  const newReview = await addDoc(collection(db, 'reviews'), {
    ...data,
    roomId,
    reply: '',
  });

  const updatedNumberOfReviews = numberOfReviews + 1;
  const newTotalRating = totalRoomRating + data.rating;
  const newAverageRating = newTotalRating / updatedNumberOfReviews;

  await putRoom(roomId, {
    totalRating: newTotalRating,
    rating: newAverageRating,
  });

  return newReview;
};

export const removeReviewForRoom = async ({
  roomId,
  totalRoomRating,
  numberOfReviews,
  reviewId,
  removedRating,
}: {
  roomId: string;
  totalRoomRating: number;
  numberOfReviews: number;
  reviewId: string;
  removedRating: number;
}) => {
  const db = getFirestore();
  await deleteDoc(doc(db, 'reviews', reviewId));

  const updatedNumberOfReviews = numberOfReviews - 1;
  const newTotalRating = totalRoomRating - removedRating;
  const newAverageRating =
    updatedNumberOfReviews !== 0 ? newTotalRating / updatedNumberOfReviews : 0;

  await putRoom(roomId, {
    totalRating: newTotalRating,
    rating: newAverageRating,
  });
};

export const addReplyToReview = async (reviewId: string, reply: string) => {
  const db = getFirestore();

  await setDoc(doc(db, 'reviews', reviewId), { reply }, { merge: true });
};
