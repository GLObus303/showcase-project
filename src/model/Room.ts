export type RoomType = {
  id: string;
  imageUrl: string;
  name: string;
  ownerId: string;
  subtitle: string;
  summary: string;
  rating: number;
  totalRating: number;
};

export type NewRoomType = Omit<RoomType, 'id' | 'rating' | 'totalRating'>;
