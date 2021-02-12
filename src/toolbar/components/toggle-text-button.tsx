import React from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  valueName: string;
  valueOn: any;
  valueOff?: any;
  style: any;
  name: string;
}

export const ToggleTextButton: React.FC<Props> = (props) => {
  const { apply, isSelected, theme } = useToolbar();
  const { name, valueOff, valueOn, valueName, style } = props;
  const selected = isSelected(name, valueOn);
  const handlePresss = () => apply(name, selected ? valueOff : valueOn);
  const styles = makeStyles(theme);
  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View style={[styles.tool, style]}>
        <Text style={styles.text}>{valueName}</Text>
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
