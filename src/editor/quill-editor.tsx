import * as React from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { createHtml } from '../utils/editor-utils';
import type {
  CustomFont,
  EditorMessage,
  EditorResponse,
  QuillConfig,
} from '../types';
import type {
  EditorEventHandler,
  EditorEventType,
  SelectionChangeData,
  EditorChangeData,
  TextChangeData,
  HtmlChangeData,
} from '../constants/editor-event';
import { Loading } from './loading';

export interface EditorState {
  webviewContent: string | null;
}

export interface EditorProps {
  style?: StyleProp<ViewStyle>;
  quill?: QuillConfig;
  customFonts?: Array<CustomFont>;
  defaultFontFamily?: string;
  initialHtml?: string;
  customStyles?: string[];
  import3rdParties?: 'local' | 'cdn';
  containerId?: string;
  theme?: { background: string; color: string; placeholder: string };
  loading?: string | React.ReactNode;
  container: boolean | React.ComponentType;
  onSelectionChange?: (data: SelectionChangeData) => void;
  onTextChange?: (data: TextChangeData) => void;
  onHtmlChange?: (data: HtmlChangeData) => void;
  onEditorChange?: (data: EditorChangeData) => void;
  webview?: WebViewProps;
  onBlur?: () => void;
  onFocus?: () => void;
}

export default class QuillEditor extends React.Component<
  EditorProps,
  EditorState
> {
  private _webview: React.RefObject<WebView>;
  private _handlers: Array<{
    event: EditorEventType;
    handler: EditorEventHandler;
  }>;
  private _promises: Array<EditorResponse>;

  constructor(props: EditorProps) {
    super(props);
    this._webview = React.createRef();
    this.state = {
      webviewContent: this.getInitalHtml(),
    };

    this._handlers = [];
    this._promises = [];
    const {
      onSelectionChange,
      onEditorChange,
      onTextChange,
      onHtmlChange,
      onBlur,
      onFocus,
    } = this.props;
    if (onSelectionChange) {
      this.on('selection-change', onSelectionChange);
    }
    if (onEditorChange) {
      this.on('editor-change', onEditorChange);
    }
    if (onTextChange) {
      this.on('text-change', onTextChange);
    }
    if (onHtmlChange) {
      this.on('html-change', onHtmlChange);
    }
    if (onBlur) {
      this.on('blur', onBlur);
    }
    if (onFocus) {
      this.on('focus', onFocus);
    }
  }

  private getInitalHtml = (): string => {
    const {
      initialHtml = '',
      import3rdParties = 'local',
      containerId = 'standalone-container',
      theme = {
        background: 'white',
        color: 'rgb(32, 35, 42)',
        placeholder: 'rgba(0,0,0,0.6)',
      },
      quill = {
        id: 'editor-container',
        placeholder: 'write here!',
        modules: {
          toolbar: false,
        },
        theme: 'snow',
      },
      customFonts = [],
      customStyles = [],
      defaultFontFamily = undefined,
    } = this.props;

    return createHtml({
      initialHtml,
      placeholder: quill.placeholder,
      theme: quill.theme ? quill.theme : 'snow',
      toolbar: JSON.stringify(quill.modules?.toolbar),
      libraries: import3rdParties,
      editorId: quill.id ? quill.id : 'editor-container',
      defaultFontFamily,
      containerId,
      color: theme.color,
      fonts: customFonts,
      backgroundColor: theme.background,
      placeholderColor: theme.placeholder,
      customStyles,
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
    switch (message.type) {
      case 'format-change':
      case 'text-change':
      case 'selection-change':
      case 'html-change':
      case 'editor-change':
      case 'blur':
      case 'focus':
        this._handlers
          .filter((x) => x.event === message.type)
          .forEach((item) => item.handler(message.data));
        break;
      case 'has-focus':
      case 'get-contents':
      case 'get-text':
      case 'get-length':
      case 'get-html':
        if (response) {
          response.resolve(message.data);
          this._promises = this._promises.filter((x) => x.key !== message.key);
        }
        break;
    }
  };

  blur = () => {
    this.post({ command: 'blur' });
  };

  focus = () => {
    this.post({ command: 'focus' });
  };

  hasFocus = (): Promise<boolean> => {
    return this.postAwait<any>({ command: 'hasFocus' });
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
    return this.postAwait<any>({ command: 'getContents', index, length });
  };

  getHtml = (): Promise<any> => {
    return this.postAwait<any>({ command: 'getHtml' });
  };

  getLength = (): Promise<any> => {
    return this.postAwait<any>({ command: 'getLength' });
  };

  getText = (index?: number, length?: number): Promise<any> => {
    return this.postAwait<any>({ command: 'getText', index, length });
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

  on = (event: EditorEventType, handler: EditorEventHandler) => {
    this._handlers.push({ event, handler });
  };

  off = (event: EditorEventType, handler: Function) => {
    const index = this._handlers.findIndex(
      (x) => x.event === event && x.handler === handler
    );
    if (index > -1) {
      this._handlers.splice(index, 1);
    }
  };

  dangerouslyPasteHTML = (index: number, html: string) => {
    this.post({ command: 'dangerouslyPasteHTML', index, html });
  };

 


  renderWebview = (
    content: string,
    style: StyleProp<ViewStyle>,
    props: WebViewProps = {}
  ) => (
    <WebView
      scrollEnabled={false}
      hideKeyboardAccessoryView={true}
      keyboardDisplayRequiresUserAction={false}
      originWhitelist={['*']}
      style={style}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      allowFileAccess={true}
      domStorageEnabled={false}
      automaticallyAdjustContentInsets={true}
      bounces={false}
      dataDetectorTypes="none"
      {...props}
      javaScriptEnabled={true}
      source={{ html: content }}
      ref={this._webview}
      onMessage={this.onMessage}
    />
  );

  render() {
    const { webviewContent } = this.state;
    const {
      style,
      webview,
      container = false,
      loading = 'Please Wait ...',
    } = this.props;

    console.log('quill-editor: ', webviewContent);
    if (container === false) {
      if (!webviewContent) return <Text>Please wait...</Text>;
      return this.renderWebview(webviewContent, style, webview);
    } else {
      const ContainerComponent = container === true ? View : container;
      return (
        <ContainerComponent style={style}>
          {webviewContent ? (
            this.renderWebview(webviewContent, styles.webView, webview)
          ) : typeof loading === 'string' ? (
            <Loading text={loading} />
          ) : (
            loading
          )}
        </ContainerComponent>
      );
    }
  }
}

let styles = StyleSheet.create({
  webView: {
    flexGrow: 1,
    borderWidth: 0,
  },
});
