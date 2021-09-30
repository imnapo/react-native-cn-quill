import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  name: string;
  valueOn: string | number | boolean;
  valueOff: string | number | boolean;
  source: ImageSourcePropType;
}

export const ToggleIconButton: React.FC<Props> = (props) => {
  const { apply, isSelected, theme, styles } = useToolbar();
  const { name, valueOff, valueOn, source } = props;
  const selected = isSelected(name, valueOn);
  const handlePresss = () => apply(name, selected ? valueOff : valueOn);
  const defaultStyles = makeStyles(theme);
  const toolStyle = styles?.selection?.iconToggle?.tool
    ? styles.selection.iconToggle.tool(defaultStyles.tool)
    : defaultStyles.tool;
  const overlayStyle = styles?.selection?.iconToggle?.overlay
    ? styles.selection.iconToggle.overlay(defaultStyles.overlay)
    : defaultStyles.overlay;
  const imageStyle = styles?.selection?.iconToggle?.image
    ? styles.selection.iconToggle.image(defaultStyles.image)
    : defaultStyles.image;
  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View style={toolStyle}>
        <Image source={source} style={imageStyle} />
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

ToggleIconButton.defaultProps = {
  valueOff: false,
};
