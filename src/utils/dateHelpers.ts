import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import { FirebaseDate } from '../model/Review';

export const fireBaseTimestampToDate = (fireBaseDate: FirebaseDate) =>
  new Timestamp(fireBaseDate.seconds, fireBaseDate.nanoseconds).toDate();

export const formatFirebaseDate = (fireBaseDate: FirebaseDate) =>
  format(fireBaseTimestampToDate(fireBaseDate), 'dd.MM.yyyy');
