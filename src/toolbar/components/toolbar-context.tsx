import React, { Component, useContext } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import { lightTheme } from '../../constants/themes';
import type { ToggleData, ToolbarCustom, ToolbarTheme } from '../../types';

export interface ContextProps {
  apply: (name: string, value: any) => void;
  selectedFormats: object;
  isSelected: (name: string, value: any) => boolean;
  theme: ToolbarTheme;
  show: (name: string, options: Array<ToggleData>) => void;
  hide: Function;
  open: boolean;
  options: Array<ToggleData>;
  selectionName: string;
  getSelected: (name: string) => any;
  width: number;
}

const ToolbarContext = React.createContext<ContextProps>({
  apply: () => {},
  show: () => {},
  hide: () => {},
  selectedFormats: {},
  open: false,
  isSelected: () => false,
  theme: lightTheme,
  options: [],
  selectionName: '',
  getSelected: () => false,
  width: 0,
});

export const ToolbarConsumer = ToolbarContext.Consumer;

interface ProviderProps {
  format: Function;
  selectedFormats: Record<string, any>;
  theme: ToolbarTheme;
  custom?: ToolbarCustom;
  style?: ViewStyle;
}

interface ProviderState {
  open: boolean;
  isAnimating: boolean;
  options: Array<ToggleData>;
  name: string;
  dimensions?: { width: number; height: number };
}

export class ToolbarProvider extends Component<ProviderProps, ProviderState> {
  animatedValue: Animated.Value;
  constructor(props: ProviderProps) {
    super(props);
    this.state = {
      open: false,
      isAnimating: false,
      options: [],
      name: '',
      dimensions: undefined,
    };
    this.animatedValue = new Animated.Value(0);
  }

  show = (name: string, options: Array<ToggleData>) => {
    if (this.state.isAnimating) return;

    const { theme } = this.props;
    const top = this.getTopBorder();
    const bottom = this.getBottomBorder();
    if (theme) {
      this.setState({ options, name, isAnimating: true }, () => {
        Animated.timing(this.animatedValue, {
          toValue: 2 * theme.size + 12 + top + bottom,
          duration: 200,
          easing: Easing.sin,
          useNativeDriver: false,
        }).start(() => this.setState({ open: true, isAnimating: false }));
      });
    }
  };

  hide = () => {
    if (this.state.isAnimating) return;
    const { theme } = this.props;
    const top = this.getTopBorder();
    const bottom = this.getBottomBorder();
    if (theme) {
      this.setState({ isAnimating: true }, () => {
        Animated.timing(this.animatedValue, {
          toValue: theme.size + 8 + top + bottom,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          this.setState({
            name: '',
            open: false,
            options: [],
            isAnimating: false,
          });
        });
      });
    }
  };

  componentDidMount() {
    const { theme } = this.props;
    const top = this.getTopBorder();
    const bottom = this.getBottomBorder();
    this.animatedValue = new Animated.Value(theme.size + 8 + top + bottom);
  }

  isSelected = (name: string, value: any = true): boolean => {
    const { selectedFormats } = this.props;
    const selected = selectedFormats[name];
    return selected ? selected === value : value === false;
  };

  getSelected = (name: string): any => {
    const { selectedFormats } = this.props;
    const selected = selectedFormats[name];
    return selected ? selected : false;
  };

  apply = (name: string, value: any) => {
    const { format, custom } = this.props;

    if (custom?.actions) custom.actions.find((x) => x === name);
    if (custom?.actions && custom?.actions?.indexOf(name) > -1) {
      if (custom?.handler) custom.handler(name, value);
    } else {
      format(name, value);
    }
  };

  onLayout = (event: LayoutChangeEvent) => {
    if (this.state.dimensions) return; // layout was already called
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width: width, height } });
  };

  getTopBorder = (): number => {
    const { style } = this.props;

    return style?.borderTopWidth
      ? style.borderTopWidth
      : style?.borderWidth
      ? style.borderWidth
      : 0;
  };

  getBottomBorder = (): number => {
    const { style } = this.props;
    return style?.borderBottomWidth
      ? style.borderBottomWidth
      : style?.borderWidth
      ? style.borderWidth
      : 0;
  };

  render() {
    const { selectedFormats, children, theme, style } = this.props;
    const { open, options, name, dimensions } = this.state;
    const top = this.getTopBorder();
    const bottom = this.getBottomBorder();
    const styles = makeStyles(theme, top, bottom);

    return (
      <ToolbarContext.Provider
        value={{
          selectedFormats,
          apply: this.apply,
          isSelected: this.isSelected,
          theme,
          open,
          show: this.show,
          hide: this.hide,
          getSelected: this.getSelected,
          selectionName: name,
          options,
          width: dimensions ? dimensions.width : 0,
        }}
      >
        <Animated.View
          onLayout={this.onLayout}
          style={[
            styles.root,
            {
              height: this.animatedValue,
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </ToolbarContext.Provider>
    );
  }
}

const makeStyles = (theme: ToolbarTheme, top: number, bottom: number) =>
  StyleSheet.create({
    root: {
      borderTopWidth: top,
      borderBottomWidth: bottom,
      borderColor: theme.color,
      position: 'relative',
      backgroundColor: theme.background,
    },
  });

export const withToolbar = (MyComponent: any) => {
  const WrappedComponent = React.forwardRef((props, ref) => (
    <ToolbarContext.Consumer>
      {(context) => (
        <MyComponent
          {...props}
          ref={ref}
          apply={context.apply}
          selectedFormats={context.selectedFormats}
        />
      )}
    </ToolbarContext.Consumer>
  ));

  return WrappedComponent;
};

export const useToolbar = (): ContextProps => useContext(ToolbarContext);
