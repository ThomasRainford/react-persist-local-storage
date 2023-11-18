import useLocalStorage from "../../../build/index";
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
      {value ? <p>{value}</p> : <div style={{ padding: "20px" }} />}
      {isValidJson(value || "") ? (
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
