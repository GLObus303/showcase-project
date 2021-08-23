import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { getRoomList, getRoomListForOwner } from '../api/rooms';
import { getUserList } from '../api/user';
import {
  useAuthContext,
  useUserGroup,
} from '../components/AuthContextProvider';
import { RoomRow } from '../components/EditableTable/RoomRow';
import { UserRow } from '../components/EditableTable/UserRow';
import { RoomType } from '../model/Room';
import { UserInfoType } from '../model/User';

export const adminUserGridClassName =
  'grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-y-4 lg:gap-y-0 lg:gap-x-4';
export const adminRestGridClassName =
  'grid grid-rows-7 lg:grid-rows-1 lg:grid-cols-7 gap-y-4 lg:gap-y-0 lg:gap-x-4';

export const Admin = () => {
  const { isAnyAdmin, isOwner } = useUserGroup();
  const authContext = useAuthContext();
  const userId = authContext?.authState?.uid;

  const [users, setUsers] = useState<UserInfoType[]>();
  const [roomList, setRoomList] = useState<RoomType[]>();

  const fetchAll = async () => {
    let roomData;
    let userData;

    if (isOwner && userId) {
      roomData = await getRoomListForOwner(userId);
    }

    if (isAnyAdmin) {
      roomData = await getRoomList();
      userData = await getUserList();
    }

    setUsers(userData);
    setRoomList(roomData);
  };

  useEffect(() => {
    fetchAll();
  }, [authContext, isAnyAdmin, isOwner]);

  if (!isAnyAdmin && !isOwner) {
    return <Redirect to="/" />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="h-full p-8 max-w-screen-2xl w-full">
        {isAnyAdmin && (
          <div className="border-2 border-black rounded-md p-4 mb-8">
            <div className="text-2xl mb-4">Users</div>
            <div className={`${adminUserGridClassName} mb-4`}>
              <div>Id</div>
              <div>Name</div>
              <div>Group</div>
              <div>Controls</div>
            </div>
            {users?.map((user) => (
              <UserRow key={user.id} {...user} refetchAll={fetchAll} />
            ))}
          </div>
        )}

        <div className="border-2 border-black rounded-md p-4 mb-8">
          <div className="text-2xl mb-4">Rooms</div>
          <div className={`${adminRestGridClassName} mb-4`}>
            <div>Id</div>
            <div>Image url</div>
            <div>Name</div>
            <div>OwnerId</div>
            <div>Subtitle</div>
            <div>Summary</div>
          </div>
          {roomList?.map((rest) => (
            <RoomRow key={rest.id} {...rest} refetchAll={fetchAll} />
          ))}
        </div>
      </div>
    </div>
  );
};
