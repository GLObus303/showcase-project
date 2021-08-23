import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getRoom } from '../api/rooms';
import { Rating } from '../components/Rating';
import { Loader } from '../components/Loader';
import { ReactComponent as Edit } from '../assets/edit.svg';
import { ReactComponent as Cross } from '../assets/times.svg';
import { RoomType } from '../model/Room';
import { useAuthContext } from '../components/AuthContextProvider';
import { ReviewSection } from '../components/ReviewSection';

export const RoomDetail = () => {
  const [room, setRoom] = useState<RoomType>();

  const { id } = useParams<{ id: string }>();
  const authContext = useAuthContext();

  const loggedUserId = authContext?.authState?.uid;

  const isRoomOwner = loggedUserId === room?.ownerId;

  const fetchRoomList = async () => {
    const roomData = await getRoom(id);

    setRoom(roomData);
  };

  useEffect(() => {
    fetchRoomList();
  }, [id]);

  if (!room) {
    return <Loader />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="h-full p-8 max-w-screen-xl w-full">
        <div className="flex justify-between">
          <div className="flex text-xl md:text-3xl font-semibold">
            {room?.name}
            {isRoomOwner && (
              <Link to="/admin">
                <Edit className="w-8 h-8 ml-4" />
              </Link>
            )}
          </div>

          <div className="flex">
            <Link to="/">
              <Cross className="w-8 h-8" />
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <Rating rating={room?.rating} isSimple={false} />
        </div>

        <img
          src={room?.imageUrl}
          alt="Room"
          className="max-h-80 rounded-md my-4"
        />
        <div className="text-lg md:text-2xl font-semibold pb-4">
          {room?.subtitle}
        </div>
        <div>{room?.summary}</div>

        <ReviewSection
          isRoomOwner={isRoomOwner}
          room={room}
          fetchRoomList={fetchRoomList}
        />
      </div>
    </div>
  );
};
