# ansi-to-react

This package convert ANSI escape codes to formatted text output for React.

## Installation

```
$ yarn add ansi-to-react
```

```
$ npm install --save ansi-to-react
```

## Usage
### Basic
The example below shows how we can use this package to render a string with ANSI escape codes.

```javascript
import Ansi from "ansi-to-react";

export function () => {
  return <Ansi>
    {'\u001b[34mhello world'}
  </Ansi>;
};
```
Will render
```javascript
<code>
    <span style="color:rgb(0, 0, 187)">hello world</span>
</code>
```

### Classes
Style with classes instead of `style` attribute.
```javascript
<Ansi useClasses>
    {'\u001b[34mhello world'}
</Ansi>;
```
Will render
```javascript
<code>
    <span class="ansi-blue-fg">hello world</span>
</code>
```

#### Class Names
|Font color| Background Color
|---|---|
|ansi-black-fg|ansi-black-bg
|ansi-red-fg|ansi-red-bg
|ansi-green-fg|ansi-green-bg
|ansi-yellow-fg|ansi-yellow-bg
|ansi-blue-fg|ansi-blue-bg
|ansi-magenta-fg|ansi-magenta-bg
|ansi-cyan-fg|ansi-cyan-bg
|ansi-white-fg|ansi-white-bg
|ansi-bright-black-fg|
|ansi-bright-red-fg|
|ansi-bright-green-fg|
|ansi-bright-yellow-fg|
|ansi-bright-blue-fg|
|ansi-bright-magenta-fg|
|ansi-bright-cyan-fg|
|ansi-bright-white-fg|

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:ansi-to-react` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
