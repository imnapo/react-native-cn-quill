import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';
import { ToggleTextButton } from './toggle-text-button';
import { ToggleColorButton } from './toggle-color-button';
import { ToggleIconButton } from './toggle-icon-button';
import { formatType } from '../../constants/formats';

interface Props {
  toolStyle: StyleProp<ViewStyle>;
  selectionStyle: StyleProp<ViewStyle>;
}

export const SelectionBar: React.FC<Props> = ({
  toolStyle,
  selectionStyle,
}) => {
  const { theme, options, hide, selectionName } = useToolbar();
  const styles = useStyles(theme);

  return (
    <View style={[styles.selection, selectionStyle]}>
      <ScrollView
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scroll]}
      >
        {options &&
          options.map((item, index) => {
            if (
              item.type === formatType.color &&
              item.valueOn !== true &&
              typeof item.valueOn !== 'number'
            ) {
              return (
                <ToggleColorButton
                  key={index}
                  name={selectionName}
                  valueOff={false}
                  style={toolStyle}
                  valueOn={item.valueOn}
                />
              );
            } else if (item.type === formatType.icon) {
              return (
                <ToggleIconButton
                  key={index}
                  source={item.source}
                  name={selectionName}
                  valueOff={false}
                  style={toolStyle}
                  valueOn={item.valueOn}
                />
              );
            } else
              return (
                <ToggleTextButton
                  key={index}
                  name={selectionName}
                  valueOff={false}
                  style={toolStyle}
                  valueOn={item.valueOn}
                  valueName={item.name}
                />
              );
          })}
      </ScrollView>
      <TouchableOpacity onPress={() => hide()}>
        <View style={[styles.close]}>
          <Text style={styles.text}>X</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = (theme: ToolbarTheme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.overlay,
      borderRadius: 3,
    },
    selection: {
      padding: 2,
      position: 'absolute',
      top: 0,
      backgroundColor: theme.overlay, //'=rgba(0,0,0,.1)',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: theme.size + 4,
    },
    scroll: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: theme.color,
      fontWeight: 'bold',
    },
    close: {
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.overlay,
      paddingHorizontal: 10,
      marginRight: 2,
      marginLeft: 4,
      height: Math.round(theme.size - 6),
    },
  });
