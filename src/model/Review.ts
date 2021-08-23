export type ReviewType = {
  id: string;
  name: string;
  date: FirebaseDate;
  creationDate: FirebaseDate;
  text: string;
  rating: number;
  reply?: string;
  roomId: string;
};

export type NewReviewType = {
  name: string;
  date: Date;
  creationDate: Date;
  text: string;
  rating: number;
};

export type FirebaseDate = {
  seconds: number;
  nanoseconds: number;
};
