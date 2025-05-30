# react-persist-local-storage

A React hook for persisting, syncing and managing state in local storage.

Supports object and string types.

## Features

- Keeps React state in sync with local storage.
- Keeps local storage in sync between windows.
- Add, update and delete local storage items.
- Type hinting when using objects!

## Example Usage:

### Initial value as `string`:

```tsx
import useLocalStorage from "react-persist-local-storage";

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

### Initial value as `object`:

```tsx
import useLocalStorage, {
  LocalStorageValue
} from "react-persist-local-storage";

const Example = () => {
  const key = "example.value";
  const [value, setValue, deleteValue] = useLocalStorage(key, {
    value: "example value"
  });

  return (
    <div>
      <input
        value={JSON.stringify(value) || ""}
        onChange={(e) =>
          setValue(
            JSON.parse(e.target.value) as LocalStorageValue<typeof value>
          )
        }
      />
      {/* 
        'value' is typed! 
        'value' is nullable as it can be removed from local storage.
      */}
      <p>{value?.value || ""}</p>
      <button disabled={!value} onClick={() => deleteValue(key)}>
        Delete "{key}"
      </button>
    </div>
  );
};

export default Example;
```

## Reference

### `useLocalStorage(key, initialValue, options)`

#### Parameters

- `key`: The local storage key.
- `initialValue`: Initial value of the localstorage value.
- `options.sync`: Enable local storage syncing between windows.

#### Returns

##### `[value, setValue, deleteItem]`

1. The serialized local storage value.
2. Function for setting the local storage value.
3. Function for removing the local storage item.

## Development

### Requirements

- [NodeJs](https://nodejs.org/)

#### To install dependencies:

```bash
npm install
```

#### Build in watch mode:

```bash
npm run dev
```

#### Run example:

```bash
cd ./examples
npm run dev
```
