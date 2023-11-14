/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import useLocalStorage from "../../index";
import "./App.css";

const ComponentOne = () => {
  const [value, setValue] = useLocalStorage("component.one.test", {
    value: "test value",
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
    <div>
      <h1>useLocalStorage test updates</h1>
      <p>Current local storage value displayed below input.</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>{value}</p>
      <h5>{isValidJson(value) ? "Found JSON" : "-"}</h5>
    </div>
  );
};

function App() {
  return <ComponentOne />;
}

export default App;
