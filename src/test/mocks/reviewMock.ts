import { FirebaseDate, ReviewType } from '../../model/Review';

export const firebaseDateMock: FirebaseDate = {
  seconds: 1629193057,
  nanoseconds: 67000000,
};

export const reviewMock: ReviewType = {
  id: 'idMock',
  name: 'nameMock',
  date: firebaseDateMock,
  creationDate: firebaseDateMock,
  text: 'textMock',
  rating: 1,
  reply: '',
  roomId: 'roomIdMock',
};
