import { screen } from '@testing-library/react';

import { renderWithContext } from '../../test/utils/renderWithContext';
import { RoomCard } from '../RoomCard';
import { roomMock } from '../../test/mocks/roomMock';

describe('RoomCard', () => {
  it('should render header, logo redirects to homepage', () => {
    const { container } = renderWithContext(<RoomCard {...roomMock} />);

    expect(screen.getByText(/namemock/i)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
