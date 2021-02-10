# react-native-cn-quill

react-native richtext editor with quilljs

## Installation

```sh
npm install react-native-cn-quill
```

## Usage

```js
import { QuillEditor, QuillToolbar } from "react-native-cn-quill";

// ...

  setEditorRef = (ref) => {
    this._editor = ref;
  };

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <KeyboardAvoidingView
          style={styles.conatainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.editor}>
            <QuillEditor ref={this._editor} />
          </View>
          <View>
            <QuillToolbar editor={this._editor} options="full" theme="light" />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

var styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  conatainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#eee",
  },
  editor: {
    flex: 1,
    margin: 20,
    backgroundColor: "#fff",
    minHeight: 300,
    paddingHorizontal: 15,
  },
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
