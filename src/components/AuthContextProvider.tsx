import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { useHistory } from 'react-router-dom';

import { AuthUserInfoType } from '../model/User';
import { getUserInfo } from '../api/user';
import { Loader } from './Loader';

export type AuthUserType = AuthUserInfoType & { uid: User['uid'] };

export type AuthContextValueType = {
  handleSignUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<UserCredential>;
  handleSignIn: (email: string, password: string) => Promise<UserCredential>;
  handleLogout: () => void;
  authState: AuthUserType | undefined | null;
};

export const AuthContext = createContext<AuthContextValueType>(
  null as any as AuthContextValueType,
);

export const AuthContextProvider: React.FC = ({ children }) => {
  const history = useHistory();

  const [authState, updateAuthState] = useState<AuthUserType | null>();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userInfo = await getUserInfo(user.uid);

        updateAuthState({ ...user, ...userInfo });
      } else {
        updateAuthState(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = useCallback(async () => {
    await getAuth().signOut();

    updateAuthState(null);

    history.push('/');
  }, []);

  const handleLogin = useCallback((userData: AuthUserType) => {
    updateAuthState(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }, []);

  const handleSignUp = useCallback(
    async (name: string, email: string, password: string) => {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      ).catch(({ message }) => {
        throw new Error(message);
      });

      await updateProfile(userCredential.user, {
        displayName: name,
      }).catch(({ message }) => {
        throw new Error(message);
      });

      if (userCredential) {
        handleLogin({
          uid: userCredential.user.uid,
          name,
          group: 'basic',
        });
      }

      return userCredential;
    },
    [handleLogin],
  );

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      ).catch(({ message }) => {
        throw new Error(message);
      });

      if (userCredential) {
        const userId = userCredential.user.uid;
        const { id, ...userInfo } = await getUserInfo(userId);

        handleLogin({
          uid: userId,
          ...userInfo,
        });
      }

      return userCredential;
    },
    [handleLogin],
  );

  const value = useMemo(
    () => ({
      handleSignUp,
      handleSignIn,
      authState,
      handleLogout,
    }),
    [handleSignUp, handleSignIn, authState, handleLogout],
  );

  return (
    <AuthContext.Provider value={value || {}}>
      {authState === undefined ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useUserInfo = (): AuthUserInfoType | undefined => {
  const authState = useContext(AuthContext)?.authState;

  if (!authState) {
    return;
  }

  return {
    name: authState.name,
    group: authState.group,
  };
};

export const useUserGroup = () => {
  const userInfo = useUserInfo();

  return {
    isBasicUser: userInfo?.group === 'basic',
    isOwner: userInfo?.group === 'owner',
    isAdmin: userInfo?.group === 'admin',
    isSuperadmin: userInfo?.group === 'superadmin',
    isAnyAdmin: userInfo?.group === 'admin' || userInfo?.group === 'superadmin',
  };
};
