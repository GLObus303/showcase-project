import { Button, message } from 'antd';
import { useEffect, useState } from 'react';

import {
  getHighestReviewForRoom,
  getLowestReviewForRoom,
  getReviewsForRoom,
  removeReviewForRoom,
} from '../../api/reviews';
import { RoomType } from '../../model/Room';
import { ReviewType } from '../../model/Review';
import { useUserGroup } from '../AuthContextProvider';
import { Rating } from '../Rating';
import { AddReview } from './AddReview';
import { Review } from './Review';
import { SortDropdown } from './SortDropdown';

type ReviewSectionProps = {
  isRoomOwner: boolean;
  room: RoomType;
  fetchRoomList: () => Promise<void>;
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  isRoomOwner,
  room,
  fetchRoomList,
}) => {
  const [roomReviews, setRoomReviews] = useState<ReviewType[]>();
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [highestReview, setHighestReview] = useState<ReviewType>();
  const [lowestReview, setLowestReview] = useState<ReviewType>();

  const { isBasicUser } = useUserGroup();

  const fetchReviewList = async () => {
    const reviewData = await getReviewsForRoom(room.id);

    if (reviewData?.length) {
      setRoomReviews(reviewData);
    }
  };

  const fetchTopLowReviews = async () => {
    const [highest] = await getHighestReviewForRoom(room.id);
    const [lowest] = await getLowestReviewForRoom(room.id);

    if (lowest && lowest.id !== highest?.id) {
      setLowestReview(lowest);
    }

    if (highest) {
      setHighestReview(highest);
    }
  };

  useEffect(() => {
    fetchReviewList();
  }, [room.id]);

  useEffect(() => {
    fetchTopLowReviews();
  }, [room.id]);

  const refetchAllReviews = async () => {
    await Promise.all([fetchReviewList(), fetchTopLowReviews()]);
  };

  const fetchAll = async () => {
    await fetchRoomList();
    refetchAllReviews();
  };

  const handleReviewRemove = async (
    reviewId: string,
    removedRating: number,
  ) => {
    try {
      await removeReviewForRoom({
        roomId: room.id,
        totalRoomRating: room.totalRating,
        numberOfReviews: roomReviews?.length || 0,
        reviewId,
        removedRating,
      });

      await fetchAll();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="mt-16">
      {highestReview && (
        <div className="flex flex-col mt-4" data-testid="highest-rated-review">
          <div className="font-bold text-yellow-400">Highest rated!</div>
          <Review
            {...highestReview}
            isRoomOwner={isRoomOwner}
            fetchReviews={refetchAllReviews}
            borderColor="border-yellow-400"
          />
        </div>
      )}

      {lowestReview && lowestReview.id !== highestReview?.id && (
        <div className="flex flex-col mt-4" data-testid="lowest-rated-review">
          <div className="font-bold text-red-400">Lowest rated :(</div>

          <Review
            {...lowestReview}
            isRoomOwner={isRoomOwner}
            fetchReviews={refetchAllReviews}
            borderColor="border-red-400"
          />
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex items-center text-lg md:text-xl">
          <Rating rating={room?.rating} />
          &nbsp;-&nbsp;{roomReviews?.length || 0}&nbsp;reviews
        </div>

        <div className="flex align-center">
          {isBasicUser && (
            <Button
              onClick={() => setIsReviewFormVisible(!isReviewFormVisible)}
            >
              {isReviewFormVisible ? 'Cancel' : 'Add review'}
            </Button>
          )}

          <SortDropdown
            roomId={room.id}
            setNewReviewList={(newList) => setRoomReviews(newList)}
          />
        </div>
      </div>

      {isReviewFormVisible && (
        <AddReview
          roomId={room.id}
          totalRoomRating={room?.totalRating}
          numberOfReviews={roomReviews?.length || 0}
          closeForm={() => setIsReviewFormVisible(false)}
          fetchAll={fetchAll}
        />
      )}

      {roomReviews?.length ? (
        <div className="flex flex-col mt-4" data-testid="reviews-container">
          {roomReviews?.map((review) => (
            <Review
              key={review.id}
              {...review}
              isRoomOwner={isRoomOwner}
              fetchReviews={refetchAllReviews}
              handleReviewRemove={handleReviewRemove}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex justify-center items-center h-16 font-bold"
          data-testid="no-reviews-message"
        >
          There are not reviews, yet :(. Be the first one!
        </div>
      )}
    </div>
  );
};
