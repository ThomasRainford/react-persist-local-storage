import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import useLocalStorage from "../index";

describe("useLocalStorage tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("useLocalStorage string value", () => {
    const testKey = "test.key";
    const testValue = "test value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testValue)
    );
    const [value] = result.current;

    expect(localStorage.getItem(testKey)).toBe(testValue);
    expect(value).toBe(testValue);
  });

  test("setting string value", () => {
    const testKey = "test.key";
    const testValue = "test value";
    const newTestValue = "new test value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testValue)
    );
    const [, setValue] = result.current;

    act(() => {
      setValue(newTestValue);
    });

    expect(localStorage.getItem(testKey)).toBe(newTestValue);
    expect(result.current[0]).toBe(newTestValue);
  });

  test("useLocalStorage object value", () => {
    const testKey = "test.key";
    const testValue = { value: "test value" };
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testValue)
    );
    const [value] = result.current;

    expect(localStorage.getItem(testKey)).toBe(JSON.stringify(testValue));
    expect(value).toEqual(testValue);
  });

  test("setting object value", () => {
    const testKey = "test.key";
    const testValue = { value: "test value" };
    const newTestValue = { value: "new test value" };
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testValue)
    );
    const [, setValue] = result.current;

    act(() => {
      setValue(newTestValue);
    });

    expect(localStorage.getItem(testKey)).toBe(
      JSON.stringify(newTestValue)
    );
    expect(result.current[0]).toBe(newTestValue);
  });

  test("uses existing localStorage value instead of initialValue", () => {
    const testKey = "test.key";
    const existingValue = "already set";
    const initialValue = "initial value";
    localStorage.setItem(testKey, existingValue);

    const { result } = renderHook(() =>
      useLocalStorage(testKey, initialValue)
    );

    expect(result.current[0]).toBe(existingValue);
    expect(localStorage.getItem(testKey)).toBe(existingValue);
  });

  test("delete local storage item", () => {
    const testKey = "test.key";
    const testValue = "test value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, testValue)
    );
    const [, , deleteItem] = result.current;

    act(() => {
      deleteItem();
    });

    expect(localStorage.getItem(testKey)).toBeNull();
    expect(result.current[0]).toBeNull();
  });

  test("Storage event syncs string values between hooks when sync enabled", () => {
    const testKey = "test1.key";
    const test1Value = "test1 value";
    const { result: result1 } = renderHook(() =>
      useLocalStorage(testKey, test1Value, { sync: true })
    );
    const test2Value = "test2 value";
    const { result: result2 } = renderHook(() =>
      useLocalStorage(testKey, test2Value, { sync: true })
    );

    const newTestValue = "new test value";

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: testKey,
          newValue: newTestValue
        })
      );
    });

    expect(result1.current[0]).toBe(newTestValue);
    expect(result2.current[0]).toBe(newTestValue);
  });

  test("Storage event syncs JSON values between hooks when sync enabled", () => {
    const testKey = "test1.key";
    const test1Value = { value: "test1 value" };
    const { result: result1 } = renderHook(() =>
      useLocalStorage(testKey, test1Value, { sync: true })
    );
    const test2Value = { value: "test2 value" };
    const { result: result2 } = renderHook(() =>
      useLocalStorage(testKey, test2Value, { sync: true })
    );

    const newTestValue = { value: "new test value" };

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: testKey,
          newValue: JSON.stringify(newTestValue)
        })
      );
    });

    expect(result1.current[0]).toEqual(newTestValue);
    expect(result2.current[0]).toEqual(newTestValue);
  });

  test("Storage event is ignored when sync is not enabled", () => {
    const testKey = "test.key";
    const initialValue = "initial value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, initialValue)
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: testKey,
          newValue: "updated value"
        })
      );
    });

    expect(result.current[0]).toBe(initialValue);
  });

  test("Storage event with null key is ignored", () => {
    const testKey = "test.key";
    const initialValue = "initial value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, initialValue, { sync: true })
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: null, newValue: "updated value" })
      );
    });

    expect(result.current[0]).toBe(initialValue);
  });

  test("Storage event with non-matching key is ignored", () => {
    const testKey = "test.key";
    const initialValue = "initial value";
    const { result } = renderHook(() =>
      useLocalStorage(testKey, initialValue, { sync: true })
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "other.key",
          newValue: "updated value"
        })
      );
    });

    expect(result.current[0]).toBe(initialValue);
  });
});
