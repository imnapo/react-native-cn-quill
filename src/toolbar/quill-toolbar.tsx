import React, { Component } from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import { fullOptions, basicOptions } from "../constants/toolbar-options";
import type {
  ToolbarTheme,
  TextListData,
  ToggleData,
  ColorListData,
} from "../types";
import { lightTheme, darkTheme } from "../constants/themes";
import { getToolbarData } from "../utils/toolbar-utils";
import type { QuillEditor } from "../editor/quill-editor";
import { ToolbarProvider } from "./components/toolbar-context";
import { SelectionBar } from "./components/selection-bar";
import { ToolSet } from "./components/tool-set";
import { ToolbarSeperator } from "./components/toolbar-separator";
import { EditorEventType } from "../constants/editor-event";
const WIDTH = Dimensions.get("window").width;

interface customStyles {
  toolbar?: object;
  toolset?: object;
  tool?: object;
}

interface QuillToolbarProps {
  options: Array<Array<string | object> | string | object> | "full" | "basic";
  styles?: customStyles;
  editor: React.RefObject<QuillEditor>;
  theme: ToolbarTheme | "dark" | "light";
}

interface ToolbarState {
  toolSets: Array<Array<ToggleData | TextListData | ColorListData>>;
  formats: object;
  theme: ToolbarTheme;
}

export class QuillToolbar extends Component<QuillToolbarProps, ToolbarState> {
  public static defaultProps = {
    theme: "dark",
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

    if (this.props.theme === "dark") {
      theme = darkTheme;
    } else if (this.props.theme !== "light") {
      theme = this.props.theme;
    }
    this.setState({ theme });
  }

  private prepareIconset = () => {
    const { options } = this.props;
    let toolbarOptions: Array<Array<string | object> | string | object> = [];
    if (options === "full" || options === []) {
      toolbarOptions = fullOptions;
    } else if (options === "basic") {
      toolbarOptions = basicOptions;
    } else {
      toolbarOptions = options;
    }
    const toolSets = getToolbarData(toolbarOptions);
    this.setState({ toolSets });
  };

  private listenToEditor = () => {
    setTimeout(() => {
      const {
        editor: { current },
      } = this.props;

      if (current) {
        this.editor = current;
        current.on(EditorEventType.formatChange, this.onFormatChange);
      }
    }, 100);
  };

  private onFormatChange = (formats: object) => {
    this.setState({ formats });
  };

  private format = (name: string, value: any) => {
    this.editor?.format(name, value);
  };

  render() {
    const { styles } = this.props;
    const { toolSets, theme, formats } = this.state;
    const classes = makeStyles(theme);

    return (
      <ToolbarProvider
        theme={theme}
        format={this.format}
        selectedFormats={formats}
      >
        <SelectionBar toolStyle={styles?.tool} />
        <View style={[classes.toolbar, styles?.toolbar]}>
          <ScrollView
            horizontal={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
          >
            {toolSets.map((object, index) => {
              return (
                object.length > 0 && (
                  <React.Fragment key={index}>
                    <ToolSet
                      tools={object}
                      style={styles?.toolset}
                      toolStyle={styles?.tool}
                    />
                    {toolSets.length > index && (
                      <ToolbarSeperator color={theme.color} />
                    )}
                  </React.Fragment>
                )
              );
            })}
          </ScrollView>
        </View>
      </ToolbarProvider>
    );
  }
}

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    toolbar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: WIDTH,
      padding: 2,
      backgroundColor: theme.background,
      flexDirection: "row",
      justifyContent: "flex-start",
      height: theme.size + 8,
    },
  });
