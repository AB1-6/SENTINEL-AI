import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}