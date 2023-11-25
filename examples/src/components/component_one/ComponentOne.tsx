import useLocalStorage from "react-persist-local-storage";
import "./ComponentOne.css";

/**
 * This example component supports a local storage value of object, string
 * and null types.
 */
const ComponentOne = () => {
  const key = "component.one.example";
  const [value, setValue, deleteValue] = useLocalStorage(
    key,
    "Test Value"
  );

  return (
    <div className="component-border" style={{ paddingBottom: "15px" }}>
      <h3>Component One</h3>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <div>
        <p>
          <b>Current local storage value:</b>
        </p>
        {value ? <p>{value}</p> : <div style={{ margin: "56px" }} />}
      </div>
      <button disabled={!value} onClick={() => deleteValue()}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default ComponentOne;
