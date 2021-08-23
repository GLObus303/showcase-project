import { Button, Input, message, Popconfirm } from 'antd';
import React, { ChangeEvent, useState } from 'react';

import { addReplyToReview } from '../../api/reviews';
import { ReviewType } from '../../model/Review';
import { formatFirebaseDate } from '../../utils/dateHelpers';
import { useUserGroup } from '../AuthContextProvider';
import { Rating } from '../Rating';
import { ReactComponent as Trash } from '../../assets/trash.svg';

type ReviewProps = {
  isRoomOwner: boolean;
  fetchReviews: () => Promise<void>;
  handleReviewRemove?: (
    reviewId: string,
    removedRating: number,
  ) => Promise<void>;
  borderColor?: string;
} & ReviewType;

export const Review: React.FC<ReviewProps> = ({
  id: reviewId,
  name,
  date,
  text,
  rating,
  reply,
  isRoomOwner,
  fetchReviews,
  borderColor = 'border-black',
  handleReviewRemove,
}) => {
  const { isAnyAdmin } = useUserGroup();

  const [ownerReply, setOwnerReply] = useState('');

  const handleReply = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOwnerReply(e.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      await addReplyToReview(reviewId, ownerReply);

      await fetchReviews();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className={`p-4 border-2 ${borderColor} rounded-md mb-4`}>
      <div className="flex justify-between">
        <span className="text-lg">
          <span className="text-lg font-semibold">{name}</span>,{' '}
          {formatFirebaseDate(date)}
        </span>
        <Rating rating={rating} isSimple={false} />
      </div>

      <div className="mt-4 last:mt-0">{text}</div>

      {reply && (
        <div className="text-sm bg-gray-300 px-4 py-2 mt-2 rounded-md">
          <span className="font-semibold">Owner's reply:</span>
          <div>{reply}</div>
        </div>
      )}

      {!reply && isRoomOwner && (
        <div className="w-full flex justify-between bg-gray-300 px-4 py-2 mt-2 rounded-md">
          <Input.TextArea
            placeholder="Owner's reply..."
            className="mr-4"
            onChange={handleReply}
          />
          <Button shape="round" type="primary" onClick={handleReplySubmit}>
            Reply
          </Button>
        </div>
      )}

      {isAnyAdmin && handleReviewRemove && (
        <div className="w-full flex justify-end">
          <Popconfirm
            title="Are you sure to delete this review?"
            onConfirm={() => handleReviewRemove(reviewId, rating)}
            okText="Yes"
            cancelText="No"
          >
            <Trash
              className="w-6 h-6 mt-4 cursor-pointer"
              data-testid="delete-icon"
            />
          </Popconfirm>
        </div>
      )}
    </div>
  );
};
