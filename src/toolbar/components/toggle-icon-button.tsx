import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  name: string;
  valueOn: any;
  valueOff: any;
  source: any;
  style: any;
}

export const ToggleIconButton: React.FC<Props> = (props) => {
  const { apply, isSelected, theme } = useToolbar();
  const { name, valueOff, valueOn, source, style } = props;
  const selected = isSelected(name, valueOn);
  const handlePresss = () => apply(name, selected ? valueOff : valueOn);
  const styles = makeStyles(theme);
  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View style={[styles.tool, style]}>
        <Image source={source} style={[styles.image]} />
        {selected && <View style={[styles.overlay]} />}
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
