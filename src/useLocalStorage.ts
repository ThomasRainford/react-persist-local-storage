/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T | null
): [string, (_: string) => void] => {
  const parseInitialValue = useCallback(<T>(initialValue: T) => {
    return typeof initialValue === "object"
      ? JSON.stringify(initialValue)
      : String(initialValue);
  }, []);

  // State to store the local storage value
  const [storedValue, setStoredValue] = useState<string>(() => {
    const parsedInitialValue = parseInitialValue(initialValue);
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : parsedInitialValue || "";
    } catch (error) {
      console.error(error);
      return parsedInitialValue || "";
    }
  });

  // Effect to update local storage when value changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
