import useLocalStorage, { LocalStorageValue } from "../../../build/index";
import "./ComponentOne.css";

/**
 * This example component supports a local storage value of object, string
 * and null types.
 */
const ComponentOne = () => {
  const key = "component.one.example";
  const [value, setValue, deleteValue] = useLocalStorage(key, {
    value: "test value"
  });

  const parseValueAsString = (val: LocalStorageValue<typeof value>) => {
    if (val === null) return "";
    if (typeof val === "object") return JSON.stringify(val);
    else return String(val);
  };

  const isValidJson = (value: string) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const valueString = parseValueAsString(value);

  return (
    <div className="component-border" style={{ paddingBottom: "15px" }}>
      <h3>Component One</h3>
      <p>Current local storage value displayed below input.</p>
      <input
        value={valueString || ""}
        onChange={(e) => {
          const isJson = isValidJson(e.target.value);
          const newValue: typeof value = isJson
            ? JSON.parse(e.target.value)
            : e.target.value;
          setValue(newValue);
        }}
      />
      {value ? <p>{valueString}</p> : <div style={{ padding: "20px" }} />}
      {isValidJson(valueString || "") ? (
        <h5>Found JSON</h5>
      ) : (
        <div style={{ padding: "24px" }} />
      )}
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default ComponentOne;
