# react-local-storage-persist

A React hook for persisting and managing state in local storage.

## Example Usage:

```tsx
import useLocalStorage from "../../../index";

const Example = () => {
  const key = "example.value";
  const [value, setValue, deleteValue] = useLocalStorage(key, {
    value: "example value"
  });

  return (
    <div>
      <input
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>{value}</p>
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default Example;
```

## Development

This package requires [Bun](https://bun.sh/).

To install dependencies:

```bash
bun install
```

To build:

```bash
bun run build
```

Run example:

```bash
cd ./examples
bun dev
```
