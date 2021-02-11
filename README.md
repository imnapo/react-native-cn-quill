# react-native-cn-quill

react-native-cn-quill is a react-native module for the Quill Rich Text Editor.

<img src="./images/quill-editor.jpeg" width="50%">

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
import { SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, StatusBar } from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
export default function App() {
  const _editor = React.createRef();

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Quill Editor</Text>
      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.editor}>
          <QuillEditor ref={_editor} />
        </View>
        <View>
          <QuillToolbar editor={_editor} options="full" theme="light" />
        </View>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
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
    backgroundColor: '#eee',
  },
  container: {
    flex: 1,
  },
  editor: {
    flex: 1,
    marginHorizontal: 40,
    backgroundColor: '#fff',
    padding: 15,
  },
});
```
## API
### QuillEditor Props

| Name | Description | Required |
| ------ | ----------- | ---- |
| style | Styles applied to the outermost component. | No |


### QuillEditor Instance methods

Read about these methods and their functionality on [Quill Api](https://quilljs.com/docs/api/)

| Name | Params | Returns |
| ------ | ---- | ------ |
| focus | - | void |
| blur | - | void |
| hasFocus | - | `Promise<boolean>` |
| enable | `enable?` | void |
| disable | - | void |
| format | `name: string, value: any` | void |
| deleteText | `index: number, length: number` | void |
| getContents | `index?: number, length?: number` | `Promise` |
| getHtml | - | `Promise` |
| getLength | - | `Promise` |
| getText | `index?: number, length?: number` | `Promise` |
| on | - | `event: EditorEventType, handler: Function` |
| off | - | `event: EditorEventType` |
| disable | - | void |

### QuillToolbar Props

| Name | Description | Required |
| ------ | ----------- | ---- |
| styles | `{ toolbar?, toolset?, tool? }` | No |
| editor | `React.RefObject<QuillEditor>` | Yes |
| theme | `ToolbarTheme object, 'dark' , 'light'` | Yes |
| options | `'full' , 'basic', array (ex: [['bold', 'italic'], ['link', 'image']])` | Yes |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
