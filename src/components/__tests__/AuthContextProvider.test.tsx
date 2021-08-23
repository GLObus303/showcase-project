import { render, screen } from '@testing-library/react';

import { AuthContextProvider } from '../AuthContextProvider';

jest.useFakeTimers();

describe('AuthContextProvider', () => {
  it('should render with loader', () => {
    render(<AuthContextProvider>childrenMock</AuthContextProvider>);

    expect(screen.getByTestId('loader-component')).toBeInTheDocument();
  });
});
