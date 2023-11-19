# react-persist-local-storage

A React hook for persisting and managing state in local storage.

Supports object and string types.

## Example Usage:

### Initial value as `object`:

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
        value={JSON.stringify(value) || ""}
        onChange={(e) => setValue(JSON.parse(e.target.value))}
      />
      {/* 'value' is statically typed! */}
      <p>{value.value}</p>
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default Example;
```

### Initial value as `string`:

```tsx
import useLocalStorage from "../../../index";

const Example = () => {
  const key = "example.value";
  const [value, setValue, deleteValue] = useLocalStorage(
    key,
    "string value"
  );

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

### Requirements

- [Bun](https://bun.sh/)

To install dependencies:

```bash
bun install
```

To build:

Note: The build uses `tsc` instead of `Bun` as `Bun` currenlty has a bug where React is bundled in the build which causes the `Invalid hook call` error. Once this has been fixed, `Bun` will be used

```bash
bun run build
```

Run example:

```bash
cd ./examples
bun dev
```
