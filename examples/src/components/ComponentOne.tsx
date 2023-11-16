import useLocalStorage from "../../../index";
import "./ComponentOne.css";

const ComponentOne = () => {
  const key = "component.one.example";
  const [value, setValue, deleteValue] = useLocalStorage(key, {
    value: "test value"
  });

  const isValidJson = (value: string) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="component-border" style={{ paddingBottom: "15px" }}>
      <h3>Component One</h3>
      <p>Current local storage value displayed below input.</p>
      <input
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {value ? <p>{value}</p> : <div style={{ padding: "20px" }}></div>}
      <h5>{isValidJson(value || "") ? "Found JSON" : ""}</h5>
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default ComponentOne;
