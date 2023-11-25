/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useCallback, useState } from "react";
import { isValidJson } from "./util";

export type LocalStorageValue<T> = T extends null
  ? null
  : T extends object
    ? T | null
    : string | null;

type UseLocalStorageReturnValue<T> = [
  LocalStorageValue<T>,
  (_: LocalStorageValue<T>) => void,
  (_: string) => void
];

/**
 * A hook that persists state in local storage.
 * Returns the state value and setter as well as a function
 * to delete the local storage item.
 *
 * When this hook is called, a new local storage item is created
 * with the key 'key' and value 'initialValue'. The setter function
 * will set the state and local storage value to the given value. The
 * delete function will remove the local storage item from local storage.
 *
 * @param key Local storage key.
 * @param initialValue Initial value of local storage item.
 * @returns State value, a set state function and a function to remove the local storage value.
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T | null
): UseLocalStorageReturnValue<T> => {
  /**
   * Returns the string value of 'value'. If 'value'
   * is an object, then return a JSON string. Otherwise, return
   * 'value' as a string.
   *
   * @param value - The value to parse to a string.
   * @return A string value of 'value'.
   */
  const parseValue = useCallback(<T>(value: T): string => {
    return typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  }, []);

  // State to store the local storage value.
  // Sets the inital value to the current local storage value.
  // Otherwise, set the inital value to 'parsedInitialValue'.
  const [storedValue, setStoredValue] = useState<LocalStorageValue<T>>(
    () => {
      const parsedInitialValue = parseValue(initialValue);
      try {
        const item = localStorage.getItem(key);
        if (!item) localStorage.setItem(key, parsedInitialValue);
        const isJson = isValidJson(item || "");
        return isJson ? JSON.parse(item || "") : item;
      } catch (error) {
        console.error(error);
        return parsedInitialValue || "";
      }
    }
  );

  /**
   * Sets the state value to 'value'.
   *
   * @param value - The new local storage value.
   */
  const setValue = (value: LocalStorageValue<T>) => {
    try {
      setStoredValue(value);
      let newValue = parseValue(value);
      localStorage.setItem(key, newValue);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes the item from local storage.
   * Also, the state value is set to null.
   */
  const deleteItem = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(null as LocalStorageValue<T>);
  }, []);

  return [storedValue, setValue, deleteItem];
};

export default useLocalStorage;
