import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, StyleSheet } from 'react-native';
import { createHtml } from '../utils/editor-utils';
import type { EditorMessage, EditorResponse } from '../types';
import { EditorEventType } from '../constants/editor-event';

export interface EditorState {
  webviewContent: string | null;
}

export interface EditorProps {
  style?: any;
}

export default class QuillEditor extends React.Component<
  EditorProps,
  EditorState
> {
  private _webview: React.RefObject<WebView>;
  private _formatChangeHandlers: Array<Function>;
  private _promises: Array<EditorResponse>;

  constructor(props: EditorProps) {
    super(props);
    this._webview = React.createRef();
    this.state = {
      webviewContent: null,
    };
    this._formatChangeHandlers = [];
    this._promises = [];
  }

  componentDidMount() {
    this.loadHTMLFile();
  }

  private loadHTMLFile = async () => {
    const HTML = createHtml();
    this.setState({ webviewContent: HTML });
  };

  blur = () => {
    this.post({ type: 'blur' });
  };

  focus = () => {
    this.post({ type: 'focus' });
  };

  private getKey(): string {
    var timestamp = new Date().getUTCMilliseconds();
    return `${timestamp}${Math.random()}`;
  }

  hasFocus = (): Promise<boolean> => {
    return this.postAwait<any>({ type: 'hasFocus' });
  };

  enable = (enable = true) => {
    this.post({ type: 'enable', value: enable });
  };

  disable = () => {
    this.post({ type: 'enable', value: false });
  };

  update = () => {
    this.post({ type: 'update' });
  };

  format = (name: string, value: any) => {
    this.post({ type: 'format', name, value });
  };

  deleteText = (index: number, length: number) => {
    this.post({ type: 'deleteText', index, length });
  };

  getContents = (index?: number, length?: number): Promise<any> => {
    return this.postAwait<any>({ type: 'getContents', index, length });
  };

  getHtml = (): Promise<any> => {
    return this.postAwait<any>({ type: 'getHtml' });
  };

  getLength = (): Promise<any> => {
    return this.postAwait<any>({ type: 'getLength' });
  };

  getText = (index?: number, length?: number): Promise<any> => {
    return this.postAwait<any>({ type: 'getText', index, length });
  };

  private postAwait<T>(data: any): Promise<T> {
    const key = this.getKey();
    let resolveFn: (value: T | PromiseLike<T>) => void;
    resolveFn = () => {};
    const promise = new Promise<T>((resolve) => {
      resolveFn = resolve;
    });

    const resp: EditorResponse = {
      key,
      resolve: resolveFn,
    };

    this._promises.push(resp);
    this.post({ ...data, key });

    return promise;
  }

  on = (event: EditorEventType, handler: Function) => {
    if (event === EditorEventType.formatChange) {
      this._formatChangeHandlers.push(handler);
    }
  };

  off = (event: EditorEventType) => {
    if (event === EditorEventType.formatChange) {
      this._formatChangeHandlers = [];
    }
  };

  private post = (obj: object) => {
    const jsonString = JSON.stringify(obj);
    this._webview.current?.postMessage(jsonString);
  };

  private toMessage = (data: string): EditorMessage => {
    const message: EditorMessage = JSON.parse(data);
    return message;
  };

  onMessage = (event: any) => {
    const message = this.toMessage(event.nativeEvent.data);

    const response = message.key
      ? this._promises.find((x) => x.key === message.key)
      : undefined;
    if (message.type === 'format-change') {
      this._formatChangeHandlers.forEach((handler) => handler(message.data));
    } else if (
      message.type === 'has-focus' ||
      message.type === 'get-contents' ||
      message.type === 'get-text' ||
      message.type === 'get-length' ||
      message.type === 'get-html'
    ) {
      if (response) {
        response.resolve(message.data);
        this._promises = this._promises.filter((x) => x.key !== message.key);
      }
    }
  };

  render() {
    const { webviewContent } = this.state;
    const { style } = this.props;
    if (!webviewContent) return <Text>Please wait...</Text>;

    return (
      <View style={[styles.container, style]}>
        <WebView
          scrollEnabled={false}
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
          ref={this._webview}
          onMessage={this.onMessage}
          style={styles.webView}
          // renderError={(error) => console.log('error:', error)}
          source={{ html: webviewContent }}
          allowFileAccess={true}
          domStorageEnabled={false}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          javaScriptEnabled={true}
          automaticallyAdjustContentInsets
          mixedContentMode="always"
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flexGrow: 1,
    borderWidth: 0,
  },
});
