import { Slider } from 'antd';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { getOrderedRoomList } from '../api/rooms';
import { RoomType } from '../model/Room';

export const BASE_RATING_FILTER: [number, number] = [0, 5];

export const SliderFilter: React.FC<{
  updateRoomList: (newList: RoomType[]) => void;
}> = ({ updateRoomList }) => {
  const [range, setRange] = useState<[number, number]>(BASE_RATING_FILTER);

  const handleListFetch = async (newRange: [number, number]) => {
    const newList = await getOrderedRoomList(newRange);

    updateRoomList(newList);
  };

  const debouncedFetchHandler = useCallback(debounce(handleListFetch, 600), []);

  const handleFilterChange = (newRange: [number, number]) => {
    setRange(newRange);

    debouncedFetchHandler(newRange);
  };

  return (
    <div className="flex items-center">
      Filter by rating
      <Slider
        onChange={handleFilterChange}
        range
        min={0}
        max={5}
        step={0.5}
        value={range}
        className="w-32 ml-4 antslider"
      />
    </div>
  );
};
