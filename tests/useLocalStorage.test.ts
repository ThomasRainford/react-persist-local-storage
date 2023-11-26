/// <reference lib="dom" />

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, test } from "bun:test";
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
});
