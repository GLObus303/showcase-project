import { Rate } from 'antd';

import { ReactComponent as Star } from '../assets/star.svg';

type RatingProps = { rating?: number; isSimple?: boolean };

export const Rating: React.FC<RatingProps> = ({
  rating = 0,
  isSimple = true,
}) => (
  <div className="flex items-center">
    <div className="text-lg md:text-xl">{Math.round(rating * 100) / 100}</div>

    {isSimple ? (
      <Star className="ml-1 w-5 h-5 mb-1 text-ant" />
    ) : (
      <>
        <Star className="ml-1 w-5 h-5 mb-1 text-ant md:hidden" />
        <Rate
          value={rating}
          allowHalf
          disabled
          className="ml-1 hidden md:block anticon"
        />
      </>
    )}
  </div>
);
