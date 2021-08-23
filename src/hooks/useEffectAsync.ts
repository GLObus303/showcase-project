import { useEffect } from 'react';

export const useEffectAsync = (fn: () => PromiseLike<any>, deps?: any[]) =>
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
