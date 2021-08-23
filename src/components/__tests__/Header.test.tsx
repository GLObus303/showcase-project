import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import { renderWithContext } from '../../test/utils/renderWithContext';
import { Header } from '../Header';
import {
  authAdminUserMock,
  loggedUserMock,
  authOwnerUserMock,
} from '../../test/mocks/userMock';

describe('Header', () => {
  it('should render header, logo redirects to homepage', () => {
    const { history } = renderWithContext(<Header />);

    userEvent.click(screen.getByText(/resco/i));
    expect(history.location.pathname).toBe('/');
  });

  it('should render header for admin user, redirect to admin', () => {
    const { history } = renderWithContext(<Header />, {
      user: authAdminUserMock,
    });

    userEvent.click(screen.getByText(/nameadminmock/i));
    expect(history.location.pathname).toBe('/admin');
  });

  it('should render header for owner user, redirect to admin', () => {
    const { history } = renderWithContext(<Header />, {
      user: authOwnerUserMock,
    });

    userEvent.click(screen.getByText(/nameownermock/i));
    expect(history.location.pathname).toBe('/admin');
  });

  it('should render header for basic user, no admin redirect, logout is called after logout click', () => {
    const { history, context } = renderWithContext(<Header />);

    userEvent.click(screen.getByText(/namemock/i));
    expect(history.location.pathname).toBe('/');

    userEvent.click(screen.getByTestId('signout-icon'));
    expect(context.handleLogout).toBeCalled();
  });

  it('should render header for logged out user, sign in redirects to login page', () => {
    const { history } = renderWithContext(<Header />, { user: loggedUserMock });

    userEvent.click(
      screen.getByRole('link', {
        name: /sign up/i,
      }),
    );
    expect(history.location.pathname).toBe('/login');
  });
});
