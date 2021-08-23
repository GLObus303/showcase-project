import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { ReactComponent as SignOutIcon } from '../assets/sign.svg';
import { useAuthContext, useUserGroup } from './AuthContextProvider';

export const Header = () => {
  const authContext = useAuthContext();
  const { isAnyAdmin, isOwner } = useUserGroup();

  const userInfo = authContext?.authState;

  return (
    <div className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-lg fixed">
      <Link to="/">
        <div className="text-3xl">Resco</div>
      </Link>
      {userInfo?.uid ? (
        <div className="flex items-center text-ant underline">
          {isAnyAdmin || isOwner ? (
            <Link to="/admin">{userInfo?.name}</Link>
          ) : (
            userInfo?.name
          )}
          <SignOutIcon
            tabIndex={0}
            onKeyDown={({ key }) =>
              key === 'Enter' && authContext?.handleLogout()
            }
            onClick={authContext?.handleLogout}
            className="h-8 ml-4 p-1 text-ant border-blue border-2 border-ant rounded-full cursor-pointer"
            data-testid="signout-icon"
          />
        </div>
      ) : (
        <Button type="primary" shape="round">
          <Link to="/login">Sign up</Link>
        </Button>
      )}
    </div>
  );
};
