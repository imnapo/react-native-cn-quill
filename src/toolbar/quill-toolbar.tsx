import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { fullOptions, basicOptions } from '../constants/toolbar-options';
import type {
  ToolbarTheme,
  TextListData,
  ToggleData,
  ColorListData,
  ToolbarCustom,
} from '../types';
import { lightTheme, darkTheme } from '../constants/themes';
import { getToolbarData } from '../utils/toolbar-utils';
import type QuillEditor from '../editor/quill-editor';
import { ToolbarProvider } from './components/toolbar-context';
import { SelectionBar } from './components/selection-bar';
import { ToolsBar } from './components/tools-bar';
import type { FormatChangeData } from '../constants/editor-event';
// const WIDTH = Dimensions.get('window').width;

interface customStyles {
  toolbar?: ViewStyle;
  selection?: StyleProp<ViewStyle>;
  toolset?: object;
  tool?: object;
}

interface QuillToolbarProps {
  options: Array<Array<string | object> | string | object> | 'full' | 'basic';
  styles?: customStyles;
  editor: React.RefObject<QuillEditor>;
  theme: ToolbarTheme | 'dark' | 'light';
  custom?: ToolbarCustom;
  container?: false | 'avoiding-view' | React.ComponentType;
  showSelectionbar?: 'top' | 'bottom';
}

interface ToolbarState {
  toolSets: Array<Array<ToggleData | TextListData | ColorListData>>;
  formats: object;
  theme: ToolbarTheme;
}

export class QuillToolbar extends Component<QuillToolbarProps, ToolbarState> {
  public static defaultProps = {
    theme: 'dark',
    showSelectionbar: 'top',
  };

  constructor(props: QuillToolbarProps) {
    super(props);
    this.state = {
      toolSets: [],
      formats: {},
      theme: lightTheme,
    };
  }

  editor?: QuillEditor;

  componentDidMount() {
    this.listenToEditor();
    this.prepareIconset();
    this.changeTheme();
  }

  componentDidUpdate(prevProps: QuillToolbarProps) {
    if (prevProps.options !== this.props.options) {
      this.prepareIconset();
    }
    if (prevProps.theme !== this.props.theme) {
      this.changeTheme();
    }
  }

  changeTheme() {
    let theme: ToolbarTheme = lightTheme;

    if (this.props.theme === 'dark') {
      theme = darkTheme;
    } else if (this.props.theme !== 'light') {
      theme = this.props.theme;
    }
    this.setState({ theme });
  }

  private prepareIconset = () => {
    const { options, custom } = this.props;
    let toolbarOptions: Array<Array<string | object> | string | object> = [];
    if (options === 'full' || options === []) {
      toolbarOptions = fullOptions;
    } else if (options === 'basic') {
      toolbarOptions = basicOptions;
    } else {
      toolbarOptions = options;
    }
    const toolSets = getToolbarData(toolbarOptions, custom?.icons);
    this.setState({ toolSets });
  };

  private listenToEditor = () => {
    setTimeout(() => {
      const {
        editor: { current },
      } = this.props;
      if (current) {
        this.editor = current;
        current.on('format-change', this.onFormatChange);
      }
    }, 200);
  };

  private onFormatChange = (data: FormatChangeData) => {
    this.setState({ formats: data.formats });
  };

  private format = (name: string, value: any) => {
    this.editor?.format(name, value);
  };

  renderToolbar = () => {
    const { styles, custom, showSelectionbar = 'top' } = this.props;
    const { toolSets, theme, formats } = this.state;
    return (
      <ToolbarProvider
        theme={theme}
        format={this.format}
        selectedFormats={formats}
        custom={custom}
        style={styles?.toolbar}
      >
        <SelectionBar
          showSelectionbar={showSelectionbar}
          toolStyle={styles?.tool}
          selectionStyle={styles?.selection}
        />
        <ToolsBar
          showSelectionbar={showSelectionbar}
          theme={theme}
          toolSets={toolSets}
          toolStyle={styles?.toolset}
          toolsetStyle={styles?.toolset}
        />
      </ToolbarProvider>
    );
  };

  render() {
    const { container = 'avoiding-view' } = this.props;
    if (container === 'avoiding-view')
      return (
        <KeyboardAvoidingView
          onTouchStart={(e) => e.stopPropagation()}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {this.renderToolbar()}
        </KeyboardAvoidingView>
      );
    else if (container === false) return this.renderToolbar();
    else {
      const ContainerComponent = container;
      return <ContainerComponent>{this.renderToolbar()}</ContainerComponent>;
    }
  }
}
