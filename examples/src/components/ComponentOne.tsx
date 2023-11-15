import useLocalStorage from "../../../src/useLocalStorage";
import "./ComponentOne.css";

const ComponentOne = () => {
  const key = "component.one.test";
  const [value, setValue] = useLocalStorage(key, {
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
    <div className="component-border">
      <h3>Component One</h3>
      <p>Current local storage value displayed below input.</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>{value}</p>
      <h5>{isValidJson(value) ? "Found JSON" : ""}</h5>
    </div>
  );
};

export default ComponentOne;
