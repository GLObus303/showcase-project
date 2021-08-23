import React from 'react';
import { render, waitFor, act, cleanup } from '@testing-library/react';
import { useState } from 'react';

import { useEffectAsync } from '../useEffectAsync';

afterEach(cleanup);

const TestComponent = ({ asyncFunc }: any) => {
  const [state, setState] = useState('Hello');

  useEffectAsync(async () => {
    const newState = await asyncFunc();

    act(() => setState(newState));
  }, []);

  return <div data-testid="effect-test">{state}</div>;
};
const asyncFunc = () => Promise.resolve('World');

describe('useEffectAsync', () => {
  test('should render "Hello" then "World"', async () => {
    const { getByTestId } = render(<TestComponent asyncFunc={asyncFunc} />);

    expect(getByTestId('effect-test').textContent).toEqual('Hello');

    await waitFor(() => getByTestId('effect-test'));

    expect(getByTestId('effect-test').textContent).toEqual('World');
  });
});
