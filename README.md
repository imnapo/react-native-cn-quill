## Important announcement
"The react-native-cn-quill" is now an open project and I'm no longer **actively maintaining** it. If you're interested in contributing or taking over its maintenance, please feel free to reach out to me!" This message clearly communicates the change in maintenance status and invites interested contributors to get in touch.

# react-native-cn-quill
react-native-cn-quill is a rich-text editor for react-native. We've created this library on top of Quill Api.

<img src="./images/quill-editor.jpeg" width="50%">

## Why Quill

Quill is a free, open source WYSIWYG editor built for the modern web. Completely customize it for any need with its modular architecture and expressive API. Read more [here](https://quilljs.com/guides/why-quill/).

## Prerequisite

This package is using `react-native-webview`. Please follow [this document](https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md) to install it.

## Installation

#### Install using npm:

```sh
npm i react-native-cn-quill
```

#### Install using yarn:

```
yarn add react-native-cn-quill
```

## Usage

Here is a simple overview of our components usage.

```js
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
export default function App() {
  const _editor = React.createRef();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="auto" />
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        initialHtml="<h1>Quill Editor for react-native</h1>"
      />
      <QuillToolbar editor={_editor} options="full" theme="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  root: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#eaeaea',
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
  },
});
```

# QuillEditor

QuillEditor is the main component of this library. You may easily add it to your application. It is also a wrapper for Quill and provides most of it's functionalities.

## QuillEditor Props

### `style`

Styles applied to the outermost component.

| Type         | Required |
| ------------ | -------- |
| `view.style` | No       |

---

### `initialHtml`

The Initial html string to display in editor.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

---

### `customStyles`

List of custom css string to be added to HTML Head.
| Type | Required |
| ----------- | ----------- |
| `string[]` | No |

---

### `defaultFontFamily`

Name of default font-family. you may use it only when you've added a custom font and it must be default font of the editor.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

---

### `customFonts`

List of custom fonts to be added to editor.
For now just base64 embed font-face can be used.
For more information check the example project.
This is sample data you may pass to this property: `[{name: 'Roboto', css: '@font-face {font-family: 'Roboto', src: url(base64);'}]`
| Type | Required |
| ----------- | ----------- |
| `Array<{name, css}>` | No |

---

### `quill`

You may pass several options to customize quill to suit your needs .
| Type | Required | description
| ----------- | ----------- | ----------- |
| `{ id, modules: { toolbar, clipboard? }, theme, placeholder }` | No | described below |

#### `quill.id`

HTML id of the container where the editor will be appended.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

#### `quill.placeholder`

Placeholder text to show when editor is empty.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

#### `quill.modules`

list of quill modules. (toolbar and clipboard implemented)

- In order to enable quill's built in toolbar pass `true` or a simple array of format names to `quill.modules.toolbar`.
- For clipboard module pass a clipboard object as string to `quill.modules.clipboard`. An array of matchers can be passed into Clipboard’s configuration options. These will be appended after Quill’s own default matchers. (from QuillJs docs)

| Type                                                | Required |
| --------------------------------------------------- | -------- |
| `{toolbar: boolean \| array, clipboard?: string; }` | No       |

Example:

```
<QuillEditor
  quill={{
    modules: {
              clipboard: `{
                matchers: [
                  ['B', customMatcherA],
                  [Node.TEXT_NODE, customMatcherB]
                ]
              }`
            },
  }}
/>
```

#### `quill.theme`

Specify Quill's officially suppoted themes. (custom theme hasn't implemented yet)
| Type | Required |
| ----------- | ----------- |
| `'snow' \| 'bubble'` | No |

---

### `import3rdParties`

We provide two ways to import required 3rd party scritps and styles. this option is only for the editor's own scripts and styles like quill's script and styles and it's not related to custom styles.
| Type | Required |
| ----------- | ----------- |
| `'local' \| 'cdn'` | No |

---

### `containerId`

HTML element id of the container for the quill object.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

---

### `loading`

Custom text or component to display before webview loaded.
| Type | Required |
| ----------- | ----------- |
| `string \| React.ReactNode` | No |

---

### `customJS`

The users in the JS code will have access to the Quill object and thus can create, import and register with the Quill object.
| Type | Required |
| ----------- | ----------- |
| `string` | No |

#### Example from Quill js website : Extending Blots

You can also extend existing formats. Here is a quick ES6 implementation of a list item that does not permit formatting its contents. Code blocks are implemented in exactly this way.

```
<QuillEditor
  customJS={`
  var ListItem = Quill.import('formats/list/item');

  class PlainListItem extends ListItem {
    formatAt(index, length, name, value) {
      if (name === 'list') {
        // Allow changing or removing list format
        super.formatAt(name, value);
      }
      // Otherwise ignore
    }
  }

  Quill.register(PlainListItem, true);
`}
/>
```

---

### `theme`

You may easily make your editor look good with the help of themes. you can pass color for `background`, `text` and `placeholder`.
| Type | Required |
| ----------- | ----------- |
| `{ background: string; color: string; placeholder: string }` | No |

---

### `container`

The container component of `webview`. you may pass `false` to remove container or pass a custom component. Defaults to `true` which will wrap the `webview` inside a `view` component.
| Type | Required |
| ----------- | ----------- |
| ` boolean \| React.ComponentType` | No |

---

### `autoSize`

Automatically adjust size of the editor

| Type       | Required | default |
| ---------- | -------- | ------- |
| ` boolean` | No       | false   |

#### Example

Here is a simplified example on how to setup the an autosizing container

```jsx
<QuillEditor
  autoSize
  container={true} // Make sure to enable the wrapping container (also custom container)
  ref={_editor}
  initialHtml="<h1>Quill Editor for react-native</h1>"
  style={
    { minHeight: 100, maxHeight: 500 }, // Setting minHeight and maxHeight is optional
  }
/>

```

---

### `webview`

You may specify custom props for `webview` component.
| Type | Required |
| ----------- | ----------- |
| `WebViewProps` | No |

---

### `onSelectionChange`

Calls when quill's selection changes.
| Type | Required |
| ----------- | ----------- |
| `({ range: { index, lengthmber } , oldRange: { index, length }, source }) => void` | No |

---

### `onTextChange`

Calls when when the contents of Quill have changed.
| Type | Required |
| ----------- | ----------- |
| `({ delta, oldContents, source }) => void` | No |

---

### `onHtmlChange`

Calls when when the contents of Quill have changed.
| Type | Required |
| ----------- | ----------- |
| `({ html }) => void` | No |

---

### `onDimensionsChange`

Calls when when the dimensions of Quill have changed.
| Type | Required |
| ----------- | ----------- |
| `({ height, width }) => void` | No |

---

### `onEditorChange`

Calls when the contents of Quill have changed or quill's selection have changed.
| Type | Required |
| ----------- | ----------- |
| `({name , args}) => void` | No |

---

### `onDimensionsChange`

Calls when the contents of Quill have changed or quill's selection have changed.
| Type | Required |
| ----------- | ----------- |
| `({width , height}) => void` | No |

---

### `onFocus`

The `onfocus` event occurs when the editor gets focus.
| Type | Required |
| ----------- | ----------- |
| `() => void` | No |

---

### `onBlur`

The `onBlur` event occurs when the editor loses focus.
| Type | Required |
| ----------- | ----------- |
| `() => void` | No |

---

## Editor Methods

### `focus()`

Focuses the editor.

---

### `blur()`

Removes focus from the editor.

---

### `hasFocus(): Boolean`

Checks if editor has focus.

---

### `disable()`

Make the editor readonly.

---

### `enable(enabled: boolean = true)`

Make the editor editable or readonly.

---

### `update()`

Checks for user updates and fires events, if changes have occurred.

---

## Event Methods

### `on(name: String, handler: Function)`

Adds event handler.

---

## Content Methods

### `deleteText(index: Number, length: Number)`

Deletes text from the editor.

---

### `getContents(index?: Number, length?: Number) : Promise<Delta>`

gets contents of the editor with formats.

---

### `getLength(): Promise<Number>`

gets contents of the editor with formats.

---

### `getText(index?: Number = 0, length?: Number): Promise<String>`

gets string contents of the editor.

---

### `insertEmbed(index: Number, type: String, value: any)`

Insert embedded content into the editor.

#### Example:

```
_editor.current.insertEmbed(10, 'image', 'https://quilljs.com/images/cloud.png');
```

---

### `insertText(index: number, text: string, formats?: Record<string, any>)`

Inserts text into the editor,

#### Example:

```
_editor.current.insertText(5, 'Quill', {
  'color': '#ffff00',
  'italic': true
});
```

---

### `setContents(delta: any)`

Overwrites editor with given contents.

#### Example:

```
_editor.current.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' }
]);
```

---

### `setText(text: string)`

Overwrites editor with given text.

#### Example:

```
_editor.current.setText('Hello\n');
```

---

### `setPlaceholder(text: string)`

Overwrites placeholder with given text.

#### Example:

```
_editor.current.setPlaceholder('Hello World');
```

---

### `updateContents(delta: any)`

Applies Delta to editor contents.

---

### `getFormat(index: Range = current | number, length?: number = 0): Promise<{ [string]: any }>`

Gets format from selection

#### Example:

```
_editor.current.getFormat({ index: 0, length: 5 });
_editor.current.getFormat(5);

```

---

### `getLeaf(index: Number): Promise<{ offset: number; text: string; length: number; index: number; attributes: Record<string, string> }>`

Returns the leaf Blot at the specified index within the document.
But RN can't push node thought webview event, will return simple result about selection
attributes gets from first main parent of leaf

#### Example:

```
quill.setText('Hello Good World!');
quill.formatText(6, 4, "bold", true);

let [leaf, offset] = quill.getLeaf(7);
// leaf should be a Text Blot with value "Good"
// offset should be 1, since the returned leaf started at index 6, with text "Good" and length 4

```

---

## Formatting Methods

### `format(name: String, value: any)`

Format text at user’s current selection.

#### Example:

```
_editor.current.format('color', 'red');
```

---

### `removeFormat(index: number, length: number): Promise<Delta>`

Removes all formatting and embeds within given range, returning a Delta representing the change.

#### Example:

```
quill.setContents([
  { insert: 'Hello', { bold: true } },
  { insert: '\n', { align: 'center' } },
  { insert: { formula: 'x^2' } },
  { insert: '\n', { align: 'center' } },
  { insert: 'World', { italic: true }},
  { insert: '\n', { align: 'center' } }
]);

quill.removeFormat(3, 7);
// Editor contents are now
// [
//   { insert: 'Hel', { bold: true } },
//   { insert: 'lo\n\nWo' },
//   { insert: 'rld', { italic: true }},
//   { insert: '\n', { align: 'center' } }
// ]
```

---

### `formatText(index: Number, length: Number, formats: Record<string, unknown>, source: string = 'api'): Promise<Delta>`

Formats text in the editor, returning a Delta representing the change.

#### Example:

```
quill.setText('Hello\nWorld!\n');

quill.formatText(0, 5, 'bold', true);      // bolds 'hello'

quill.formatText(0, 5, {                   // unbolds 'hello' and set its color to blue
  'bold': false,
  'color': 'rgb(0, 0, 255)'
});

quill.formatText(5, 1, 'align', 'right');  // right aligns the 'hello' line
```

---

## Selection Methods

### `getBounds(index: Number, length: Number = 0)`

Retrieves the pixel position and dimensions of a selection at a given location.

#### Example:

```
const data = await _editor.current.getBounds(7);
//Ex. Returns { height: 15, width: 0, left: 27, top: 31 }
```

---

### `getSelection(focus = false) : { index: Number, length: Number }`

Retrieves the user’s selection range.

#### Example:

```
var range = await _editor.current.getSelection();
if (range) {
  if (range.length == 0) {
    console.log('User cursor is at index', range.index);
  } else {
    var text = quill.getText(range.index, range.length);
    console.log('User has highlighted: ', text);
  }
} else {
  console.log('User cursor is not in editor');
}
```

---

### `setSelection(index: Number, length: Number = 0, source: String = 'api')`

Sets user selection to given range, which will also focus the editor. Providing null as the selection range will blur the editor. Source may be "user", "api", or "silent" [From Quill Js Docs](https://quilljs.com/docs/api/#setselection).

#### Example:

```
_editor.current.setSelection(0, 5);
```

---

## Clipboard Methods

### `dangerouslyPasteHTML(index: number, html: string)`

Inserts content represented by HTML snippet into editor at a given index.

#### Example:

```
_editor.current.dangerouslyPasteHTML(0, '<b>Hello World</b>');
```

---

Read about these methods and their functionality on [Quill Api](https://quilljs.com/docs/api/)

# QuillToolbar

The QuillToolbar component allow users to easily format Quill’s contents. QuillToolbar controls can be specified by a simple array of format names like `['bold', 'italic', 'underline', 'strike']` or by just passing 'basic' or 'full' string to options prop. we've tried to develop it just like [Quill Toolbar options](https://quilljs.com/docs/modules/toolbar/#container).

If you prefer to use quill's built-in toolbar follow [this](https://github.com/imnapo/react-native-cn-quill#quillmodules) instruction.

The QuillToolbar uses a series of icons to render controls. this controls by default applies and removes formatting, but you can easily extend or overwrite these with `custom` prop.
For example we may add the `image` and `clock` (user defined control that inserts current date to the editor) handlers just like this:

## Custom Handlers Usage

```
...
  const clockIcon = require('../assets/icons/clock.png');

  customHandler = (name: string, value: any) => {
    if (name === 'image') {
      this._editor.current?.insertEmbed(
        0,
        'image',
        'https://picsum.photos/200/300'
      );
    } else if (name === 'clock') {
      this._editor.current?.insertText(0, `Today is ${this.getCurrentDate()}`, {
        bold: true,
        color: 'red',
      });
    } else {
      console.log(`${name} clicked with value: ${value}`);
    }
  };

  render() {
    ...
        <QuillToolbar
          editor={this._editor}
          options={['image', 'clock']}
          theme="light"
          custom={{
            handler: this.customHandler,
            actions: ['image', 'clock'],
            icons: {
              clock: clockIcon,
            },
          }}
        />
        ...
  }

```

To see an example of how to fully implement this please check this [Link](https://github.com/imnapo/react-native-cn-quill/blob/master/example/src/App.tsx).

## QuillToolbar Props

### `styles`

custom styles to pass to the inner components.
| Type | Required |
| ----------- | ----------- |
| `{ toolbar : { provider, root, toolset }, selection: { root, textToggle, ... }, separator, ... }` | No |

For Example :

```
const customStyles = {
  toolbar: {
    provider: (provided) => ({
      ...provided,
      borderTopWidth: 0,
    }),
    root: (provided) => ({
      ...provided,
      backgroundColor: 'orange',
      }),
    },
  };
```

---

### `editor`

Reference of `QuillEditor` component.
| Type | Required |
| ----------- | ----------- |
| `React.RefObject<QuillEditor>` | Yes |

---

### `theme`

You may easily make your toolbar look good with the help of themes. you can pass `dark`, `light` values or custom theme object with `size`,`color`,`background` and `overlay` props. ex. `{ size: 30, color: 'white', background: 'gray', overlay: 'rgba(0,0,0,.5')})`
| Type | Required |
| ----------- | ----------- |
| `'dark' \| 'light' \| object` | No |

---

### `options`

QuillToolbar controls can be specified by a simple array of format names like `['bold', 'italic', 'underline', 'strike']` or by just passing `basic` or `full`.
| Type | Required |
| ----------- | ----------- |
| `'full' \| 'basic' \| array ` | Yes |

---

### `custom`

You can easily extend or overwrite functionality of `QuillToolbar` with `custom` prop.
| Type | Required |
| ----------- | ----------- |
| `{ handler, actions, icons }` | No |

#### `custom.handler`

| Type                                 | Required |
| ------------------------------------ | -------- |
| `(name: string, value: any) => void` | No       |

#### `custom.icons`

You may pass a dictionary of icons to overwrite or extend the default icons of toolbar. for example: `{ video: require('../assets/icons/video.png') }`
| Type | Required |
| ----------- | ----------- |
| `Record<string, any>` | No |

#### `custom.actions`

you may specify list of format names to be overwriten. for ex. `['video', 'image']`.
| Type | Required |
| ----------- | ----------- |
| `string[]` | No |

---

### `container`

The container component of `QuillToolbar`. you may pass `false` to remove container or pass a custom component. Defaults to `avoiding-view` which will wrap the `webview` inside a `KeyboardAvoidingView` component.
| Type | Required |
| ----------- | ----------- |
| `false \| 'avoiding-view' \| React.ComponentType` | No |

---

# Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

# License

MIT
