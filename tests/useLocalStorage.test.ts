import { afterEach, describe, expect, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import useLocalStorage from "../index";

describe("useLocalStorage tests", () => {
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

    expect(localStorage.getItem(testKey)).toBe(newTestValue);
    expect(result1.current[0]).toBe(newTestValue);

    expect(localStorage.getItem(testKey)).toBe(newTestValue);
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

    expect(localStorage.getItem(testKey)).toBe(
      JSON.stringify(newTestValue)
    );
    expect(result1.current[0]).toEqual(newTestValue);

    expect(localStorage.getItem(testKey)).toBe(
      JSON.stringify(newTestValue)
    );
    expect(result2.current[0]).toEqual(newTestValue);
  });
});
