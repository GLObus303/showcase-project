export const getJestMock = <F extends (...args: any[]) => any>(
  fn: F,
): jest.Mock<ReturnType<F>> => fn as unknown as jest.Mock<ReturnType<F>>;

export const resetAndMock = <T>(mock: jest.Mock<T>, returnValue: T) => {
  mock.mockReset();
  mock.mockReturnValue(returnValue);
};
