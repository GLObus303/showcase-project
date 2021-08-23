import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import {
  AuthContext,
  AuthContextValueType,
  AuthUserType,
} from '../../components/AuthContextProvider';
import { authContextMock } from '../mocks/authMock';
import { authBasicUserMock } from '../mocks/userMock';

type CustomMocks = {
  context?: AuthContextValueType;
  user?: AuthUserType;
};

export const renderWithContext = (
  component: React.ReactElement,
  { context = authContextMock, user = authBasicUserMock }: CustomMocks = {},
) => {
  const history = createMemoryHistory();

  const wrapper = ({ children }: React.PropsWithChildren<unknown>) => (
    <Router history={history}>
      <AuthContext.Provider value={{ ...context, authState: user }}>
        {children}
      </AuthContext.Provider>
    </Router>
  );

  return {
    history,
    context,
    ...render(component, { wrapper }),
  };
};
