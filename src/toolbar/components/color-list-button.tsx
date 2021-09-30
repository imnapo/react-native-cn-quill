import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import type { ToggleData, ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  name: string;
  source: ImageSourcePropType;
  items: Array<ToggleData>;
}

export const ColorListButton: React.FC<Props> = ({ name, items, source }) => {
  const {
    theme,
    show,
    hide,
    open,
    selectionName,
    getSelected,
    styles,
  } = useToolbar();
  const defaultStyles = makeStyles(theme);
  const toolStyle = styles?.toolbar?.toolset?.colorListButton?.tool
    ? styles.toolbar?.toolset?.colorListButton.tool(defaultStyles.tool)
    : defaultStyles.tool;
  const overlayStyle = styles?.toolbar?.toolset?.colorListButton?.overlay
    ? styles.toolbar?.toolset?.colorListButton.overlay(defaultStyles.overlay)
    : defaultStyles.overlay;
  const imageStyle = styles?.toolbar?.toolset?.colorListButton?.image
    ? styles.toolbar?.toolset?.colorListButton.image(defaultStyles.image)
    : defaultStyles.image;

  const showMenu = () => {
    if (open && selectionName === name) hide();
    else show(name, items);
  };

  const selectedValue = getSelected(name);
  const selectedItem = items.find((x) => x.valueOn === selectedValue);
  const isOpen = selectionName === name;
  return (
    <TouchableOpacity onPress={showMenu}>
      <View style={toolStyle}>
        <Image
          source={source}
          style={[
            imageStyle,
            {
              tintColor:
                selectedItem &&
                selectedItem.valueOn !== false &&
                typeof selectedItem.valueOn === 'string'
                  ? selectedItem.valueOn
                  : theme.color,
            },
          ]}
        />
        {isOpen && <View style={overlayStyle} />}
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.overlay,
      borderRadius: 3,
    },
    tool: {
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size),
      width: Math.round(theme.size),
    },
    image: {
      height: Math.round(theme.size * 0.6),
      width: Math.round(theme.size * 0.6),
      tintColor: theme.color,
    },
  });
