import React from 'react';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';

interface Props {
  valueOn: any;
  valueOff?: any;
  style: any;
  name: string;
}

export const ToggleColorButton: React.FC<Props> = (props) => {
  const { format, isSelected, theme } = useToolbar();
  const { name, valueOff, valueOn, style } = props;
  const selected = isSelected(name, valueOn);
  const handlePresss = () => format(name, selected ? valueOff : valueOn);
  const styles = makeStyles(theme);

  return (
    <TouchableWithoutFeedback onPress={handlePresss}>
      <View
        style={[
          styles.tool,
          style,
          {
            backgroundColor: valueOn !== false ? valueOn : theme.overlay,
          },
        ]}
      >
        {selected && <View style={[styles.overlay]} />}
        {valueOn === false && <View style={styles.noColor} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const makeStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.color,
    },
    tool: {
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size - 2),
      width: Math.round(theme.size - 2),
    },
    noColor: {
      borderTopWidth: 1,
      backgroundColor: theme.overlay,
      borderColor: theme.color,
      width: '100%',
      transform: [{ rotate: '45deg' }],
    },
  });

ToggleColorButton.defaultProps = {
  valueOff: false,
};
