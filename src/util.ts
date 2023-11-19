/**
 * Returns whether the given string 'value' is valid JSON or not.
 *
 * @param value The string value to check for JSON validity.
 * @returns Whether the given string 'value' is valid JSON.
 */
export const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};
