import { Button } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getOrderedRoomList, getRoomListForOwner } from '../api/rooms';
import {
  useAuthContext,
  useUserGroup,
} from '../components/AuthContextProvider';
import { RoomCard } from '../components/RoomCard';
import { useEffectAsync } from '../hooks/useEffectAsync';
import { RoomType } from '../model/Room';
import { ReviewType } from '../model/Review';
import { getReviewsForOwner } from '../api/reviews';
import { Review } from '../components/ReviewSection/Review';
import { SliderFilter } from '../components/SliderFilter';

export const Homepage = () => {
  const { isOwner } = useUserGroup();
  const authContext = useAuthContext();
  const userId = authContext?.authState?.uid;

  const [roomList, setRoomList] = useState<RoomType[]>();
  const [pendingReviews, setPendingReviews] = useState<ReviewType[] | null>();

  useEffectAsync(async () => {
    let data;

    if (isOwner && userId) {
      data = await getRoomListForOwner(userId);
    } else {
      data = await getOrderedRoomList();
    }

    setRoomList(data);
  }, [isOwner, authContext?.authState?.uid]);

  const fetchPendingReviews = async () => {
    if (userId && isOwner && roomList) {
      const data = await getReviewsForOwner(roomList);

      setPendingReviews(data);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, [userId, roomList]);

  return (
    <>
      <div className="h-2/4 bg-main-background bg-cover">
        <div className="h-full flex justify-center items-center bg-black-radial">
          <div className="text-white text-3xl md:text-5xl font-semibold px-4 text-center mb-8">
            Find a room around the corner
          </div>
        </div>
      </div>

      <div className="w-full h-full p-8">
        <div className="flex justify-between flex-col md:flex-row">
          <div className="text-3xl text-left mb-4 md:mb-0">Rooms</div>

          <div className="flex">
            {!isOwner && (
              <SliderFilter
                updateRoomList={(newList) => setRoomList(newList)}
              />
            )}
            {isOwner && (
              <Button type="primary">
                <Link to="/create">Add room</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="py-8 grid grid-cols-auto-fit lg:grid-cols-auto-fit-md gap-4">
          {roomList?.map(({ imageUrl, name, rating, subtitle, id }) => (
            <RoomCard
              key={id}
              id={id}
              imageUrl={imageUrl}
              name={name}
              rating={rating}
              subtitle={subtitle}
            />
          ))}
        </div>
        {pendingReviews === null && (
          <div className="flex items-center justify-center w-full text-xl font-bold">
            Start by adding your first room!
          </div>
        )}

        {isOwner && !!pendingReviews?.length && (
          <div>
            <div className="flex items-center text-lg md:text-xl">
              Pending reviews
            </div>
            {pendingReviews?.map((review) => (
              <Review
                key={review.id}
                isRoomOwner
                {...review}
                fetchReviews={fetchPendingReviews}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
