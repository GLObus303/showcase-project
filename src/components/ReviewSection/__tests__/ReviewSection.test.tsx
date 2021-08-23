import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithContext } from '../../../test/utils/renderWithContext';
import { ReviewSection } from '../index';
import { roomMock } from '../../../test/mocks/roomMock';
import { getJestMock, resetAndMock } from '../../../test/utils/mock';
import {
  getHighestReviewForRoom,
  getLowestReviewForRoom,
  getReviewsForRoom,
} from '../../../api/reviews';
import { reviewMock } from '../../../test/mocks/reviewMock';
import { authAdminUserMock } from '../../../test/mocks/userMock';

jest.mock('../../../api/reviews');
const getHighestReviewForRoomMock = getJestMock(getHighestReviewForRoom);
const getLowestReviewForRoomMock = getJestMock(getLowestReviewForRoom);
const getReviewsForRoomMock = getJestMock(getReviewsForRoom);

describe('ReviewSection', () => {
  beforeEach(() => {
    resetAndMock(getReviewsForRoomMock, Promise.resolve([]));
    resetAndMock(getLowestReviewForRoomMock, Promise.resolve([]));
    resetAndMock(getHighestReviewForRoomMock, Promise.resolve([]));
  });

  it('should render reviewSection for basic user with no reviews', async () => {
    renderWithContext(
      <ReviewSection
        isRoomOwner={false}
        room={roomMock}
        fetchRoomList={jest.fn()}
      />,
    );

    const noReviews = screen.getByText(
      /there are not reviews, yet :\(\. be the first one!/i,
    );
    expect(noReviews).toBeInTheDocument();
  });

  it('should render reviewSection for basic user with reviews', async () => {
    resetAndMock(getReviewsForRoomMock, Promise.resolve([reviewMock]));

    const fetchMock = jest.fn();
    renderWithContext(
      <ReviewSection
        isRoomOwner={false}
        room={roomMock}
        fetchRoomList={fetchMock}
      />,
    );

    await waitFor(() =>
      expect(screen.getByTestId('reviews-container')).toBeInTheDocument(),
    );

    expect(screen.getByText(/- 1 reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/textmock/i)).toBeInTheDocument();

    userEvent.click(
      screen.getByRole('button', {
        name: /add review/i,
      }),
    );

    expect(
      screen.getByRole('textbox', {
        name: /name/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render reviewSection for owner user with reviews', async () => {
    resetAndMock(getReviewsForRoomMock, Promise.resolve([reviewMock]));

    renderWithContext(
      <ReviewSection
        isRoomOwner={false}
        room={{ ...roomMock, ownerId: authAdminUserMock.uid }}
        fetchRoomList={jest.fn()}
      />,
      { user: authAdminUserMock },
    );

    await waitFor(() =>
      expect(screen.getByTestId('reviews-container')).toBeInTheDocument(),
    );

    expect(screen.getByText(/- 1 reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/textmock/i)).toBeInTheDocument();

    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });
});
