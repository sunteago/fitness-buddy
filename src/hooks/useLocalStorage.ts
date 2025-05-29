import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/localStorage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Get from local storage then
    // parse stored json or return initialValue
    // This part runs only on initial render on client side
    // if (typeof window === 'undefined') {
    //  return initialValue;
    // }
    // const item = window.localStorage.getItem(key);
    // return item ? JSON.parse(item) : initialValue;
    // Deferring localStorage access to useEffect
    return initialValue;
  });

  useEffect(() => {
    // This effect runs only on the client after hydration
    const item = getItem<T>(key);
    if (item !== null) {
      setStoredValue(item);
    }
  }, [key]);


  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        setItem<T>(key, valueToStore);
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
