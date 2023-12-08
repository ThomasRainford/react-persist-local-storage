/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { useCallback, useEffect, useState } from "react";
import { isValidJson } from "./util";

export type LocalStorageValue<T> = T extends null
  ? null
  : T extends object
    ? T | null
    : string | null;

type UseLocalStorageReturnValue<T> = [
  LocalStorageValue<T>,
  (_: LocalStorageValue<T>) => void,
  () => void
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
 * There is an option to enable syncing local storage changes between windows.
 *
 * @param key Local storage key.
 * @param initialValue Initial value of local storage item.
 * @param options.sync Enable syncing changes between windows.
 * @returns State value, a set state function and a function to remove the local storage value.
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T | null,
  options?: { sync: boolean }
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
        let item = localStorage.getItem(key);
        if (!item) localStorage.setItem(key, parsedInitialValue);
        item = localStorage.getItem(key);
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
   * @param value The new local storage value.
   */
  const setValue = (value: LocalStorageValue<T>, eventKey?: string) => {
    try {
      // Only set the state value when the key for the local storage value (key)
      // is the same as the key from an event (eventKey). Or when there is no event key.
      // If neither of these then we would set the state value for the incorrect storage value!
      if (key === eventKey || eventKey === undefined)
        setStoredValue(value);
      let newValue = parseValue(value);
      localStorage.setItem(eventKey || key, newValue);
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

  // Effect for managing storage sync.
  useEffect(() => {
    if (!options?.sync) return;
    const onStorageChange = (event: StorageEvent) => {
      let newValue: LocalStorageValue<T>;
      if (isValidJson(event.newValue as string)) {
        newValue = JSON.parse(event.newValue as string);
      } else {
        newValue = event.newValue as LocalStorageValue<T>;
      }
      setValue(newValue, event.key as string);
    };
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  return [storedValue, setValue, deleteItem];
};

export default useLocalStorage;
