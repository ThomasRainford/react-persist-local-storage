/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useCallback, useState } from "react";
import { isValidJson } from "./util";

export type LocalStorageValue<T> = T extends null
  ? null
  : T extends object
    ? T | null
    : string;

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
 * with the key 'key' and value 'initialValue'.
 *
 * @param key local storage key.
 * @param initialValue Initial value of local storage item.
 * @returns State value a set state function.
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
   * @param value
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
   * Deletes an item from local storage given by 'key'.
   * Also, the state is set to null.
   *
   * @param key - The key of the local storage item to delete.
   */
  const deleteItem = useCallback((key: string) => {
    localStorage.removeItem(key);
    setStoredValue(null as LocalStorageValue<T>);
  }, []);

  return [storedValue, setValue, deleteItem];
};

export default useLocalStorage;
