import * as React from 'react';
import {
  WebView,
  WebViewMessageEvent,
  WebViewProps,
} from 'react-native-webview';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { createHtml } from '../utils/editor-utils';
import type {
  CustomFont,
  EditorMessage,
  EditorResponse,
  GetLeafResponse,
  QuillConfig,
} from '../types';
import type {
  EditorEventHandler,
  EditorEventType,
  SelectionChangeData,
  EditorChangeData,
  TextChangeData,
  HtmlChangeData,
  DimensionsChangeData,
  Range,
} from '../constants/editor-event';
import { Loading } from './loading';

export interface EditorState {
  webviewContent: string | null;
  height?: number;
}

export interface EditorProps {
  autoSize?: boolean;
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
  container?: boolean | React.ComponentType;
  onSelectionChange?: (data: SelectionChangeData) => void;
  onTextChange?: (data: TextChangeData) => void;
  onHtmlChange?: (data: HtmlChangeData) => void;
  onEditorChange?: (data: EditorChangeData) => void;
  onDimensionsChange?: (data: DimensionsChangeData) => void;
  webview?: WebViewProps;
  onBlur?: () => void;
  onFocus?: () => void;
  customJS?: string;
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
      onDimensionsChange,
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
    if (onDimensionsChange) {
      this.on('dimensions-change', onDimensionsChange);
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
      customJS = '',
    } = this.props;

    return createHtml({
      initialHtml,
      autoSize: this.props.autoSize,
      placeholder: quill.placeholder,
      theme: quill.theme ? quill.theme : 'snow',
      toolbar: JSON.stringify(quill.modules?.toolbar),
      clipboard: quill.modules?.clipboard,
      keyboard: quill.modules?.keyboard,
      formats: quill.formats,
      libraries: import3rdParties,
      editorId: quill.id ? quill.id : 'editor-container',
      defaultFontFamily,
      containerId,
      color: theme.color,
      fonts: customFonts,
      backgroundColor: theme.background,
      placeholderColor: theme.placeholder,
      customStyles,
      customJS,
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

  private onMessage = (event: WebViewMessageEvent) => {
    const message = this.toMessage(event.nativeEvent.data);
    const { autoSize } = this.props;
    const response = message.key
      ? this._promises.find((x) => x.key === message.key)
      : undefined;
    switch (message.type) {
      case 'dimensions-change':
        if (autoSize === true) this.setState({ height: message.data.height });
        this._handlers
          .filter((x) => x.event === message.type)
          .forEach((item) => item.handler(message.data));
        break;
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
      case 'set-contents':
      case 'get-text':
      case 'get-length':
      case 'get-bounds':
      case 'get-selection':
      case 'get-dimensions':
      case 'get-html':
      case 'get-format':
      case 'get-leaf':
      case 'remove-format':
      case 'format-text':
        if (response) {
          response.resolve(message.data);
          this._promises = this._promises.filter((x) => x.key !== message.key);
        }
        break;
      default:
        // Allow catching messages using the passed webview props
        if (this.props.webview?.onMessage) {
          this.props.webview?.onMessage(event);
        }
    }
  };

  blur = () => {
    this.post({ command: 'blur' });
  };

  focus = () => {
    this.post({ command: 'focus' });

    if (Platform.OS === 'android') {
      this._webview.current?.requestFocus();
    }
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

  removeFormat = (index: number, length: number) => {
    return this.postAwait({ command: 'removeFormat', index, length });
  };

  getDimensions = (): Promise<any> => {
    return this.postAwait<any>({ command: 'getDimensions' });
  };

  getContents = (index?: number, length?: number): Promise<any> => {
    return this.postAwait<any>({ command: 'getContents', index, length });
  };

  getHtml = (): Promise<string> => {
    return this.postAwait<any>({ command: 'getHtml' });
  };

  getLength = (): Promise<number> => {
    return this.postAwait<any>({ command: 'getLength' });
  };

  getText = (index?: number, length?: number): Promise<string> => {
    return this.postAwait<any>({ command: 'getText', index, length });
  };

  getBounds = (
    index: number,
    length?: number
  ): Promise<{ left: number; top: number; height: number; width: number }> => {
    return this.postAwait<any>({ command: 'getBounds', index, length });
  };

  getSelection = (focus: boolean = false): Promise<Range> => {
    return this.postAwait<any>({ command: 'getSelection', focus });
  };

  setSelection = (index: number, length?: number, source?: String) => {
    this.post({ command: 'setSelection', index, length, source });
  };

  insertEmbed = (index: number, type: string, value: any) => {
    this.post({ command: 'insertEmbed', index, type, value });
  };

  insertText = (index: number, text: string, formats?: Record<string, any>) => {
    this.post({ command: 'insertText', index, text, formats });
  };

  setContents = (delta: any): Promise<any> => {
    return this.postAwait<any>({ command: 'setContents', delta });
  };

  setText = (text: string) => {
    this.post({ command: 'setText', text });
  };

  setPlaceholder = (text: string) => {
    this.post({ command: 'setPlaceholder', text });
  };

  updateContents = (delta: any) => {
    this.post({ command: 'updateContents', delta });
  };

  getFormat = (
    index: { index: number; length: number } | number,
    length?: number
  ): Promise<Record<string, unknown>> => {
    return this.postAwait({ command: 'getFormat', index, length });
  };

  getLeaf = (index: number): Promise<GetLeafResponse | null> => {
    return this.postAwait({ command: 'getLeaf', index });
  };

  formatText = (
    index: number,
    length: number,
    formats: Record<string, unknown>,
    source: string = 'api'
  ): Promise<any> => {
    return this.postAwait({
      command: 'formatText',
      index,
      length,
      formats,
      source,
    });
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
      nestedScrollEnabled={true}
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
    const { webviewContent, height } = this.state;
    const {
      style,
      webview,
      container = false,
      loading = 'Please Wait ...',
      autoSize = false,
    } = this.props;
    if (container === false) {
      if (!webviewContent) return <Text>Please wait...</Text>;
      return this.renderWebview(webviewContent, style, webview);
    } else {
      const ContainerComponent = container === true ? View : container;
      return (
        <ContainerComponent
          style={[style, autoSize && height ? { height } : {}]}
        >
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
