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

/** Returns true if running in a browser environment (guards against SSR). */
const isBrowser = typeof window !== "undefined";

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
 * When rendered server-side (SSR), localStorage is unavailable. In that case
 * the hook returns 'initialValue' and all write operations are no-ops until
 * the component mounts in the browser.
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
   * @param value - The value to serialize to a string.
   * @return A string representation of 'value'.
   */
  const serialize = useCallback((value: LocalStorageValue<T>): string => {
    return typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  }, []);

  /**
   * Returns the typed value of a raw localStorage string. If the string is
   * valid JSON it is parsed; otherwise the raw string is returned as-is.
   *
   * @param value - The raw string retrieved from localStorage.
   * @return The deserialized value.
   */
  const deserialize = useCallback(
    (value: string): LocalStorageValue<T> => {
      return isValidJson(value)
        ? (JSON.parse(value) as LocalStorageValue<T>)
        : (value as LocalStorageValue<T>);
    },
    []
  );

  // State to store the local storage value.
  // Sets the initial value to the current local storage value if one exists.
  // Otherwise, persists and returns 'initialValue'.
  // When running server-side (no localStorage), returns 'initialValue' directly.
  // Previously called getItem twice when the key was absent; now uses a single call.
  // Error fallback now returns the correctly-typed 'initialValue' rather than a
  // serialized string.
  const [storedValue, setStoredValue] = useState<LocalStorageValue<T>>(
    () => {
      if (!isBrowser) return initialValue as LocalStorageValue<T>;

      try {
        // Set initial value to current local storage value if exists.
        const existing = localStorage.getItem(key);
        if (existing !== null) {
          return deserialize(existing);
        }

        // Persist given initial value.
        const serialized = serialize(initialValue as LocalStorageValue<T>);
        localStorage.setItem(key, serialized);
        return initialValue as LocalStorageValue<T>;
      } catch (error) {
        console.error(
          `[useLocalStorage] Failed to initialize key "${key}":`,
          error
        );
        return initialValue as LocalStorageValue<T>;
      }
    }
  );

  /**
   * Sets the state value and persists 'value' to localStorage.
   *
   * Is a no-op when running server-side (no localStorage available).
   *
   * @param value The new local storage value.
   */
  const setValue = useCallback(
    (value: LocalStorageValue<T>) => {
      if (!isBrowser) return;
      try {
        setStoredValue(value);
        localStorage.setItem(key, serialize(value));
      } catch (error) {
        console.error(
          `[useLocalStorage] Failed to set key "${key}":`,
          error
        );
      }
    },
    [key, serialize]
  );

  /**
   * Updates state when a storage event originates from another tab or window.
   * Only applies the update when 'eventKey' matches this hook's 'key'.
   *
   * @param value The new local storage value parsed from the storage event.
   * @param eventKey The key reported by the StorageEvent.
   */
  const setValueFromEvent = useCallback(
    (value: LocalStorageValue<T>, eventKey: string) => {
      if (eventKey !== key) return;
      setStoredValue(value);
    },
    [key]
  );

  /**
   * Deletes the item from local storage.
   * Also, the state value is set to null.
   *
   * Is a no-op when running server-side (no localStorage available).
   */
  const deleteItem = useCallback(() => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
    setStoredValue(null as LocalStorageValue<T>);
  }, [key]);

  // Effect for managing storage sync.
  // Dependencies are now fully declared so the handler is never stale:
  // - options?.sync - re-registers the listener if the sync option changes.
  // - setValueFromEvent - stable reference that already captures the current key.
  // - deserialize - stable memoized helper.
  useEffect(() => {
    if (!isBrowser || !options?.sync) return;

    const onStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.newValue === null) return;
      setValueFromEvent(deserialize(event.newValue), event.key);
    };

    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, [options?.sync, setValueFromEvent, deserialize]);

  return [storedValue, setValue, deleteItem];
};

export default useLocalStorage;
