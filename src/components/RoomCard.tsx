import { Link } from 'react-router-dom';

import { RoomType } from '../model/Room';
import { Rating } from './Rating';

type RoomCardProps = Pick<
  RoomType,
  'imageUrl' | 'name' | 'rating' | 'subtitle' | 'id'
>;

export const RoomCard: React.FC<RoomCardProps> = ({
  imageUrl,
  name,
  rating,
  subtitle,
  id,
}) => (
  <div className="flex flex-col border border-black rounded-md cursor-pointer hover:shadow-2xl transition-shadow">
    <Link to={`room/${id}`}>
      <img src={imageUrl} alt="Room" className="w-full" />

      <div className="p-2 flex flex-col">
        <div className="text-lg md:text-2xl font-semibold">{name}</div>
        <div className="pb-4 md:text-lg">{subtitle}</div>
        <div className="flex justify-end items-center">
          <Rating rating={rating} />
        </div>
      </div>
    </Link>
  </div>
);
