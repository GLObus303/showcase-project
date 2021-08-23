import { Dropdown, Menu } from 'antd';

import {
  getHighestReviewForRoom,
  getLowestReviewForRoom,
  getReviewsForRoom,
} from '../../api/reviews';
import { ReviewType } from '../../model/Review';
import { ReactComponent as SortIcon } from '../../assets/sort.svg';

type SortDropdownProps = {
  roomId: string;
  setNewReviewList: (newList: ReviewType[]) => void;
};

export const SortDropdown: React.FC<SortDropdownProps> = ({
  roomId,
  setNewReviewList,
}) => {
  const fetchFromNewest = async () => {
    const reviewData = await getReviewsForRoom(roomId);
    setNewReviewList(reviewData);
  };

  const fetchFromOldest = async () => {
    const reviewData = await getReviewsForRoom(roomId, 'asc');
    setNewReviewList(reviewData);
  };

  const fetchHighest = async () => {
    const highest = await getHighestReviewForRoom(roomId);

    setNewReviewList(highest);
  };

  const fetchLowest = async () => {
    const lowest = await getLowestReviewForRoom(roomId);
    setNewReviewList(lowest);
  };

  const menu = (
    <Menu>
      <Menu.Item key="newest" onClick={fetchFromNewest}>
        From newest (default)
      </Menu.Item>
      <Menu.Item key="oldest" onClick={fetchFromOldest}>
        From oldest
      </Menu.Item>
      <Menu.Item key="highest" onClick={fetchHighest}>
        From highest rating
      </Menu.Item>
      <Menu.Item key="lowest" onClick={fetchLowest}>
        From lowest rating
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <SortIcon className="h-8 w-8 ml-4 cursor-pointer" />
    </Dropdown>
  );
};
