import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { ToggleData, ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  name: string;
  items: Array<ToggleData>;
}

export const ListButton: React.FC<Props> = ({ name, items }) => {
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
  const toolStyle = styles?.toolbar?.toolset?.listButton?.tool
    ? styles.toolbar?.toolset?.listButton.tool(defaultStyles.tool)
    : defaultStyles.tool;
  const overlayStyle = styles?.toolbar?.toolset?.listButton?.overlay
    ? styles.toolbar?.toolset?.listButton.overlay(defaultStyles.overlay)
    : defaultStyles.overlay;
  const textStyle = styles?.toolbar?.toolset?.listButton?.text
    ? styles.toolbar?.toolset?.listButton.text(defaultStyles.text)
    : defaultStyles.text;
  const imageStyle = styles?.toolbar?.toolset?.listButton?.image
    ? styles.toolbar?.toolset?.listButton.image(defaultStyles.image)
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
        {selectedItem?.source ? (
          <Image source={selectedItem.source} style={imageStyle} />
        ) : (
          <Text style={textStyle}>
            {selectedItem ? selectedItem.name : name}
          </Text>
        )}
        {isOpen && <View style={[overlayStyle]} />}
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
    },
    image: {
      height: Math.round(theme.size * 0.6),
      width: Math.round(theme.size * 0.6),
      tintColor: theme.color,
    },
    text: {
      color: theme.color,
      fontWeight: 'bold',
    },
  });
