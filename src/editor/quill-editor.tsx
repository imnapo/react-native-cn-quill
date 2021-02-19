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
  initialHtml?: string;
  placeholder?: string;
  toolbar?: boolean | Array<Array<string | object> | string | object>;
  quillTheme?: 'snow' | 'bubble';
  libraries?: 'local' | 'cdn';
  editorId?: string;
  containerId?: string;
  editorTheme?: { background: string; color: string; placeholder: string };
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
      webviewContent: this.getInitalHtml(),
    };

    this._formatChangeHandlers = [];
    this._promises = [];
  }

  private getInitalHtml = (): string => {
    const {
      initialHtml = '',
      placeholder = 'write here!',
      toolbar = false,
      libraries = 'local',
      quillTheme = 'snow',
      editorId = 'editor-container',
      containerId = 'standalone-container',
      editorTheme = {
        background: 'white',
        color: 'rgb(32, 35, 42)',
        placeholder: 'rgba(0,0,0,0.6)',
      },
    } = this.props;

    return createHtml({
      initialHtml,
      placeholder,
      theme: quillTheme,
      toolbar: JSON.stringify(toolbar),
      libraries: libraries,
      editorId,
      containerId,
      color: editorTheme.color,
      backgroundColor: editorTheme.background,
      placeholderColor: editorTheme.placeholder,
    });
  };

  private getKey(): string {
    var timestamp = new Date().getUTCMilliseconds();
    return `${timestamp}${Math.random()}`;
  }

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

  private post = (obj: object) => {
    const jsonString = JSON.stringify(obj);
    this._webview.current?.postMessage(jsonString);
  };

  private toMessage = (data: string): EditorMessage => {
    const message: EditorMessage = JSON.parse(data);
    return message;
  };

  private onMessage = (event: any) => {
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

  blur = () => {
    this.post({ command: 'blur' });
  };

  focus = () => {
    this.post({ command: 'focus' });
  };

  hasFocus = (): Promise<boolean> => {
    return this.postAwait<any>({ type: 'hasFocus' });
  };

  enable = (enable = true) => {
    this.post({ command: 'enable', value: enable });
  };

  disable = () => {
    this.post({ command: 'enable', value: false });
  };

  update = () => {
    this.post({ command: 'update' });
  };

  format = (name: string, value: any) => {
    this.post({ command: 'format', name, value });
  };

  deleteText = (index: number, length: number) => {
    this.post({ command: 'deleteText', index, length });
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

  insertEmbed = (index: number, type: string, value: any) => {
    this.post({ command: 'insertEmbed', index, type, value });
  };

  insertText = (index: number, text: string, formats?: Record<string, any>) => {
    this.post({ command: 'insertText', index, text, formats });
  };

  setContents = (delta: any) => {
    this.post({ command: 'setContents', delta });
  };

  setText = (text: string) => {
    this.post({ command: 'setText', text });
  };

  updateContents = (delta: any) => {
    this.post({ command: 'updateContents', delta });
  };

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
