# react-persist-local-storage

A React hook for persisting and managing state in local storage.

Supports object and string types.

## Features

- Keeps React state in sync with local storage.
- Add, update and delete local storage items.
- Static typing when using objects!

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

#### To install dependencies:

```bash
bun install
```

#### Build in watch mode:

Note: The build uses `tsc` instead of `bun` as `Bun` currenlty has a bug where React is bundled in the build which causes the `Invalid hook call` error. Once this has been fixed, `bun` will be used.

```bash
bun dev
```

#### Run example:

```bash
cd ./examples
bun dev
```
