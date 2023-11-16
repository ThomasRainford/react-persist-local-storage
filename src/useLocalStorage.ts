/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useCallback, useState } from "react";

type LocalStorageValue = string | null;

type UseLocalStorageReturnValue = [
  LocalStorageValue,
  (_: string) => void,
  (_: string) => void
];

/**
 *
 *
 * @param key local storage key.
 * @param initialValue Initial value of local storage item.
 * @returns State value a set state function.
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T | null
): UseLocalStorageReturnValue => {
  /**
   * Returns the string value of 'value'. If 'value'
   * is an object, then return a JSON string. Otherwise, return
   * 'value' as a string.
   *
   * @param value - The value to parse to a string.
   * @return A string value of 'value'.
   */
  const parseInitialValue = useCallback(<T>(value: T): string => {
    return typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  }, []);

  // State to store the local storage value.
  // Sets the inital value to the current local storage value.
  // Otherwise, set the inital value to 'parsedInitialValue'.
  const [storedValue, setStoredValue] = useState<string | null>(() => {
    const parsedInitialValue = parseInitialValue(initialValue);
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : parsedInitialValue || "";
    } catch (error) {
      console.error(error);
      return parsedInitialValue || "";
    }
  });

  /**
   * Sets the local storage value to 'value' and
   * the state value to 'value'.
   *
   * @param value
   */
  const setValue = (value: string | null) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes an item from local storage given by 'key'.
   * Also, the state is set to null.
   *
   * @param key - The key of the local storage item to delete.
   */
  const deleteItem = useCallback((key: string) => {
    localStorage.removeItem(key);
    setStoredValue(null);
  }, []);

  return [storedValue, setValue, deleteItem];
};

export default useLocalStorage;
