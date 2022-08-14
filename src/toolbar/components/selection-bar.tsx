import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import type { ToolbarTheme } from '../../types';
import { useToolbar } from './toolbar-context';
import { ToggleTextButton } from './toggle-text-button';
import { ToggleColorButton } from './toggle-color-button';
import { ToggleIconButton } from './toggle-icon-button';
import { formatType } from '../../constants/formats';

interface Props {}

export const SelectionBar: React.FC<Props> = ({}) => {
  const { theme, options, hide, selectionName, styles } = useToolbar();
  const defaultStyles = useStyles(theme);
  const rootStyle = styles?.selection?.root
    ? styles.selection.root(defaultStyles.selection)
    : defaultStyles.selection;
  const scrollStyle = styles?.selection?.scroll
    ? styles.selection.scroll(defaultStyles.scroll)
    : defaultStyles.scroll;
  const closeViewStyle = styles?.selection?.close?.view
    ? styles.selection.close.view(defaultStyles.close)
    : defaultStyles.close;

  const closeTextStyle = styles?.selection?.close?.text
    ? styles.selection.close.text(defaultStyles.text)
    : defaultStyles.text;
  return (
    <View style={rootStyle}>
      <ScrollView
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollStyle}
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
                  valueOn={item.valueOn}
                />
              );
            } else
              return (
                <ToggleTextButton
                  key={index}
                  name={selectionName}
                  valueOff={false}
                  valueOn={item.valueOn}
                  valueName={item.name}
                />
              );
          })}
      </ScrollView>
      <TouchableOpacity onPress={() => hide()}>
        <View style={closeViewStyle}>
          <Text style={closeTextStyle}>×</Text>
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
