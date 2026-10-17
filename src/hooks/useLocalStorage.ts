import { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, fallback: T): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const setStoredState = useCallback((value: T) => setState(value), []);

  return [state, setStoredState];
};
