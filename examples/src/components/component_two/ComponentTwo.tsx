import useLocalStorage, {
  LocalStorageValue
} from "react-persist-local-storage";
import "./ComponentTwo.css";

/**
 * This example component supports a local storage value of object, string
 * and null types.
 */
const ComponentTwo = () => {
  const key = "component.two.example";
  const [value, setValue, deleteValue] = useLocalStorage(key, {
    value: "test value"
  });

  const parseValueAsString = (val: LocalStorageValue<typeof value>) => {
    return JSON.stringify(val);
  };

  const valueString = parseValueAsString(value);

  return (
    <div className="component-border" style={{ paddingBottom: "15px" }}>
      <h3>Component Two</h3>
      <button onClick={() => setValue({ ...value, value: "value 1" })}>
        Value 1
      </button>
      <button onClick={() => setValue({ ...value, value: "value 2" })}>
        Value 2
      </button>
      <button onClick={() => setValue({ ...value, value: "value 3" })}>
        Value 3
      </button>
      <div>
        <p>
          <b>Current local storage value:</b>
        </p>
      </div>
      {value ? <p>{valueString}</p> : <div style={{ padding: "20px" }} />}
      {value ? (
        <p>
          The value has been set to <b>{value.value}</b>
        </p>
      ) : (
        <div style={{ padding: "20px" }} />
      )}
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default ComponentTwo;
