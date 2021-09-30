import React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  valueName: string;
  valueOn: string | number | boolean;
  valueOff?: string | number | boolean;
  name: string;
}

export const ToggleTextButton: React.FC<Props> = (props) => {
  const { apply, isSelected, theme, styles } = useToolbar();
  const { name, valueOff, valueOn, valueName } = props;
  const selected = isSelected(name, valueOn);
  const handlePresss = () => apply(name, selected ? valueOff : valueOn);
  const defaultStyles = makeStyles(theme);
  const toolStyle = styles?.selection?.iconToggle?.tool
    ? styles.selection.iconToggle.tool(defaultStyles.tool)
    : defaultStyles.tool;
  const overlayStyle = styles?.selection?.iconToggle?.overlay
    ? styles.selection.iconToggle.overlay(defaultStyles.overlay)
    : defaultStyles.overlay;
  const textStyle = styles?.selection?.iconToggle?.image
    ? styles.selection.iconToggle.image(defaultStyles.text)
    : defaultStyles.text;
  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View style={toolStyle}>
        <Text style={textStyle}>{valueName}</Text>
        {selected && <View style={overlayStyle} />}
      </View>
    </TouchableWithoutFeedback>
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
      paddingHorizontal: 4,
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size),
    },
    text: {
      color: theme.color,
      fontWeight: 'bold',
    },
  });

ToggleTextButton.defaultProps = {
  valueOff: false,
};
