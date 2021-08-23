import { firebaseDateMock } from '../../test/mocks/reviewMock';
import { fireBaseTimestampToDate, formatFirebaseDate } from '../dateHelpers';

describe('dateHelpers', () => {
  it('should parse time correctly', () => {
    expect(fireBaseTimestampToDate(firebaseDateMock)).toEqual(
      new Date('2021-08-17T09:37:37.067Z'),
    );

    expect(formatFirebaseDate(firebaseDateMock)).toEqual('17.08.2021');
  });
});
