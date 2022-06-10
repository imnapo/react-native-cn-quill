import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  View,
  Text,
} from 'react-native';
import { CustomContainer } from './CustomContainer';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import type {
  SelectionChangeData,
  TextChangeData,
} from 'react-native-cn-quill';
import { customFonts } from './customFonts';
const clockIcon = require('../assets/icons/clock.png');

export default class App extends React.Component<any, any> {
  private _editor: React.RefObject<QuillEditor>;
  constructor(props: any) {
    super(props);
    this._editor = React.createRef();
    this.state = {
      disabled: false,
      title: 'react-native-cn-quill',
    };
  }

  getCurrentDate() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  handleEnable = () => {
    const { disabled } = this.state;
    this._editor.current?.enable(disabled);
    this.setState({ disabled: !disabled });
  };

  handleGetHtml = () => {
    this._editor.current?.getHtml().then((res) => {
      console.log('Html :', res);
      Alert.alert(res);
    });
  };

  handleSelectionChange = async (data: SelectionChangeData) => {
    const { range } = data;
    if (range) {
      if (range.length === 0) {
        console.log('User cursor is on', range.index);
      } else {
        var text = await this._editor.current?.getText(
          range.index,
          range.length
        );
        console.log('User has highlighted', text);
      }
    } else {
      console.log('Cursor not in the editor');
    }
  };

  handleTextChange = (data: TextChangeData) => {
    if (data.source === 'api') {
      console.log('An API call triggered this change.');
    } else if (data.source === 'user') {
      console.log('A user action triggered this change.');
    }
  };

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
    const { title, disabled } = this.state;
    return (
      <SafeAreaView
        style={styles.root}
        onTouchStart={() => this._editor.current?.blur()}
      >
        <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={'dark-content'}
          showHideTransition={'fade'}
          hidden={false}
        />
        <TextInput
          style={[styles.input, styles.textbox]}
          onChangeText={(text) => this.setState({ title: text })}
          value={title}
        />
        <QuillEditor
          webview={{
            nestedScrollEnabled: true,
          }}
          container={CustomContainer} // not required just to show how to pass cusom container
          style={[styles.input, styles.editor]}
          ref={this._editor}
          onSelectionChange={this.handleSelectionChange}
          onTextChange={this.handleTextChange}
          onHtmlChange={({ html }) => console.log(html)}
          quill={{
            // not required just for to show how to pass this props
            placeholder: 'this is placeholder',
            modules: {
              toolbar: false, // this is default value
            },
            theme: 'snow', // this is default value
          }}
          //Extending Blots (from Quill js website example)
          //You can also extend existing formats.
          //Here is a quick ES6 implementation of a list item that does not permit formatting its contents.
          // Code blocks are implemented in exactly this way.
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
          defaultFontFamily={customFonts[0].name}
          customFonts={customFonts}
          import3rdParties="cdn" // default value is 'local'
          initialHtml="<h1>Quill Editor for react-native</h1><img src='https://picsum.photos/200/300'/><br/><p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</p>"
        />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.handleEnable} style={styles.btn}>
            <Text>{disabled === true ? 'Enable' : 'Disable'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleGetHtml} style={styles.btn}>
            <Text>Html</Text>
          </TouchableOpacity>
        </View>

        <QuillToolbar
          editor={this._editor}
          theme="light"
          styles={{
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
          }}
          options={[
            ['bold', 'italic', 'underline'],
            [{ header: 1 }, { header: 2 }],
            [{ align: [] }],
            [
              { color: ['#000000', '#e60000', '#ff9900', 'yellow'] },
              { background: [] },
            ],
            [{ font: ['', customFonts[1].name] }],
            ['image', 'clock'],
          ]}
          custom={{
            handler: this.customHandler,
            actions: ['image', 'clock'],
            icons: {
              clock: clockIcon,
            },
          }}
        />
      </SafeAreaView>
    );
  }
}

var styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#eaeaea',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  textbox: {
    height: 40,
    paddingHorizontal: 20,
  },
  editor: {
    flex: 1,
    padding: 0,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    margin: 3,
  },
});
