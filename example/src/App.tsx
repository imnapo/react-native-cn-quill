import * as React from 'react';

import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Button,
  Alert,
} from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';

export default class App extends React.Component<any, any> {
  private _editor: React.RefObject<QuillEditor>;

  constructor(props: any) {
    super(props);
    this._editor = React.createRef();
    this.state = {
      disabled: false,
    };
  }

  onDisabled = () => {
    this._editor.current?.focus();

    this.setState({ disabled: !this.state.disabled });
  };

  handleHasFocus = () => {
    this._editor.current?.getText().then((res) => {
      console.log('Text :', res);
      Alert.alert(res);
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <KeyboardAvoidingView
          style={styles.conatainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          onTouchStart={() => this._editor.current?.blur()}
        >
          <View style={styles.editor} onTouchStart={(e) => e.stopPropagation()}>
            <Button
              title="Focus"
              onPress={() => this._editor.current?.focus()}
            />
            <Button title="Get Text" onPress={this.handleHasFocus} />
            <QuillEditor ref={this._editor} />
          </View>
          <View onTouchStart={(e) => e.stopPropagation()}>
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
    backgroundColor: '#eee',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  editor: {
    flex: 1,
    marginTop: 10,
    marginRight: 40,
    marginLeft: 40,
    paddingBottom: 1,
    backgroundColor: '#fff',
    minHeight: 300,
    paddingHorizontal: 15,
  },
});
