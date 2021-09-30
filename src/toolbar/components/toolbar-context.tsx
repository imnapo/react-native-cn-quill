import React, { Component, useContext } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { lightTheme } from '../../constants/themes';
import type {
  CustomStyles,
  ToggleData,
  ToolbarCustom,
  ToolbarTheme,
} from '../../types';

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
  styles?: CustomStyles;
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
});

export const ToolbarConsumer = ToolbarContext.Consumer;

interface ProviderProps {
  format: Function;
  selectedFormats: Record<string, any>;
  theme: ToolbarTheme;
  custom?: ToolbarCustom;
  styles?: CustomStyles;
}

interface ProviderState {
  open: boolean;
  isAnimating: boolean;
  options: Array<ToggleData>;
  name: string;
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
    };
    this.animatedValue = new Animated.Value(0);
  }

  show = (name: string, options: Array<ToggleData>) => {
    if (this.state.isAnimating) return;

    const { theme } = this.props;
    if (theme) {
      this.setState({ options, name, isAnimating: true }, () => {
        Animated.timing(this.animatedValue, {
          toValue: 2 * theme.size + 14,
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
    if (theme) {
      this.setState({ isAnimating: true }, () => {
        Animated.timing(this.animatedValue, {
          toValue: theme.size + 10,
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
    this.animatedValue = new Animated.Value(theme.size + 10);
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

  render() {
    const { selectedFormats, children, theme, styles } = this.props;
    const { open, options, name } = this.state;
    const defaultStyles = makeStyles(theme);
    const rootStyle = styles?.toolbar?.provider
      ? styles?.toolbar?.provider(defaultStyles.root)
      : defaultStyles.root;
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
          styles,
        }}
      >
        <Animated.View
          style={[
            rootStyle,
            {
              height: this.animatedValue,
            },
          ]}
        >
          {children}
        </Animated.View>
      </ToolbarContext.Provider>
    );
  }
}

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    root: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.color,
      position: 'relative',
      backgroundColor: theme.background,
      width: '100%',
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
