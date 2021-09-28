import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, StyleSheet } from 'react-native';
import { createHtml } from '../utils/editor-utils';
import { Loading } from './loading';
import { BlockScopeAwareRuleWalker } from 'tslint';
export default class QuillEditor extends React.Component {
    constructor(props) {
        super(props);
        this.getInitalHtml = () => {
            const { initialHtml = '', import3rdParties = 'local', containerId = 'standalone-container', theme = {
                background: 'white',
                color: 'rgb(32, 35, 42)',
                placeholder: 'rgba(0,0,0,0.6)',
            }, quill = {
                id: 'editor-container',
                placeholder: 'write here!',
                modules: {
                    toolbar: false,
                },
                theme: 'snow',
            }, customFonts = [], customStyles = [], defaultFontFamily = undefined, } = this.props;
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
        this.post = (obj) => {
            const jsonString = JSON.stringify(obj);
            this._webview.current?.postMessage(jsonString);
        };
        this.toMessage = (data) => {
            const message = JSON.parse(data);
            return message;
        };
        this.onMessage = (event) => {
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
                case 'console':
                    console.info(`[Console] ${JSON.stringify(message.data)}`);
                    break;

            }
        };
        this.blur = () => {
            this.post({ command: 'blur' });
        };
        this.focus = () => {
            this.post({ command: 'focus' });
        };
        this.hasFocus = () => {
            return this.postAwait({ command: 'hasFocus' });
        };
        this.enable = (enable = true) => {
            this.post({ command: 'enable', value: enable });
        };
        this.disable = () => {
            this.post({ command: 'enable', value: false });
        };
        this.update = () => {
            this.post({ command: 'update' });
        };
        this.format = (name, value) => {
            this.post({ command: 'format', name, value });
        };
        this.deleteText = (index, length) => {
            this.post({ command: 'deleteText', index, length });
        };
        this.getContents = (index, length) => {
            return this.postAwait({ command: 'getContents', index, length });
        };
        this.getHtml = () => {
            return this.postAwait({ command: 'getHtml' });
        };
        this.getLength = () => {
            return this.postAwait({ command: 'getLength' });
        };
        this.getText = (index, length) => {
            return this.postAwait({ command: 'getText', index, length });
        };
        this.insertEmbed = (index, type, value) => {
            this.post({ command: 'insertEmbed', index, type, value });
        };
        this.insertText = (index, text, formats) => {
            this.post({ command: 'insertText', index, text, formats });
        };
        this.setContents = (delta) => {
            this.post({ command: 'setContents', delta });
        };
        this.setText = (text) => {
            this.post({ command: 'setText', text });
        };
        this.updateContents = (delta) => {
            this.post({ command: 'updateContents', delta });
        };
        this.on = (event, handler) => {
            this._handlers.push({ event, handler });
        };
        this.off = (event, handler) => {
            const index = this._handlers.findIndex((x) => x.event === event && x.handler === handler);
            if (index > -1) {
                this._handlers.splice(index, 1);
            }
        };
        this.dangerouslyPasteHTML = (index, html) => {
            this.post({ command: 'dangerouslyPasteHTML', index, html });
        };

        this.renderWebview = (content, style, props = {}) => {
            
            const debugging = `
            const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
            console = {
                log: (log) => consoleLog('log', log),
                debug: (log) => consoleLog('debug', log),
                info: (log) => consoleLog('info', log),
                warn: (log) => consoleLog('warn', log),
                error: (log) => consoleLog('error', log),
              };
          `;

                React.createElement(WebView, Object.assign({ 
                    scrollEnabled: false, 
                    hideKeyboardAccessoryView: true, 
                    keyboardDisplayRequiresUserAction: false, 
                    originWhitelist: ['*'], 
                    style: style, 
                    onError: (syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                    }, 
                    allowFileAccess: true, 
                    domStorageEnabled: false, 
                    automaticallyAdjustContentInsets: true, 
                    bounces: false, 
                    dataDetectorTypes: "none" }, 
                    props, 
                    {   javaScriptEnabled: true, 
                        source: { html: content }, 
                        ref: this._webview, 
                        onMessage: this.onMessage,
                        injectedJavaScript: {debugging}
                    }
                ))
                };

        this._webview = React.createRef();
        this.state = {
            webviewContent: this.getInitalHtml(),
        };
        this._handlers = [];
        this._promises = [];
        const { onSelectionChange, onEditorChange, onTextChange, onHtmlChange, onBlur, onFocus, } = this.props;
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

  

    getKey() {
        var timestamp = new Date().getUTCMilliseconds();
        return `${timestamp}${Math.random()}`;
    }
    postAwait(data) {
        const key = this.getKey();
        let resolveFn;
        resolveFn = () => { };
        const promise = new Promise((resolve) => {
            resolveFn = resolve;
        });
        const resp = {
            key,
            resolve: resolveFn,
        };
        this._promises.push(resp);
        this.post({ ...data, key });
        return promise;
    }
    render() {
        
        const { webviewContent } = this.state;
        console.log('quill-editorJS: ', webviewContent);
        const { style, webview, container = false, loading = 'Please Wait ...', } = this.props;
        if (container === false) {
            if (!webviewContent)
                return React.createElement(Text, null, "Please wait...");
            return this.renderWebview(webviewContent, style, webview);
        }
        else {
            const ContainerComponent = container === true ? View : container;
            return (React.createElement(ContainerComponent, { style: style }, webviewContent ? (this.renderWebview(webviewContent, styles.webView, webview)) : typeof loading === 'string' ? (React.createElement(Loading, { text: loading })) : (loading)));
        }
    }
}
let styles = StyleSheet.create({
    webView: {
        flexGrow: 1,
        borderWidth: 0,
    },
});
