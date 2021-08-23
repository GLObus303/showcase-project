import { AuthUserType } from '../../components/AuthContextProvider';

export const authBasicUserMock: AuthUserType = {
  group: 'basic',
  name: 'nameMock',
  uid: 'uidMock',
};

export const authOwnerUserMock: AuthUserType = {
  group: 'owner',
  name: 'nameOwnerMock',
  uid: 'uidMock',
};

export const authAdminUserMock: AuthUserType = {
  group: 'admin',
  name: 'nameAdminMock',
  uid: 'uidMock',
};

export const loggedUserMock = {} as AuthUserType;
