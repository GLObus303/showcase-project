import { AuthContextValueType } from '../../components/AuthContextProvider';
import { authBasicUserMock } from './userMock';

export const authContextMock: AuthContextValueType = {
  handleSignUp: jest.fn(),
  handleSignIn: jest.fn(),
  handleLogout: jest.fn(),
  authState: authBasicUserMock,
};
