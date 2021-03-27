import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  ColorListData,
  TextListData,
  ToggleData,
  ToolbarTheme,
} from '../../types';
import { ToolSet } from './tool-set';
import { ToolbarSeperator } from './toolbar-separator';

interface Props {
  toolSets: Array<Array<ToggleData | TextListData | ColorListData>>;
  toolsetStyle?: StyleProp<ViewStyle>;
  toolStyle?: StyleProp<ViewStyle>;
  theme: ToolbarTheme;
  showSelectionbar: 'top' | 'bottom';
}

export const ToolsBar: React.FC<Props> = ({
  theme,
  toolSets,
  toolsetStyle,
  toolStyle,
  showSelectionbar,
}) => {
  const classes = useStyles(theme, showSelectionbar);
  return (
    <View style={[classes.toolbar]}>
      <ScrollView
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {toolSets.map((object, index) => {
          return (
            object.length > 0 && (
              <React.Fragment key={index}>
                <ToolSet
                  tools={object}
                  style={toolsetStyle}
                  toolStyle={toolStyle}
                />
                {toolSets.length > index && (
                  <ToolbarSeperator color={theme.color} />
                )}
              </React.Fragment>
            )
          );
        })}
      </ScrollView>
    </View>
  );
};

const useStyles = (theme: ToolbarTheme, showSelectionbar: 'top' | 'bottom') =>
  StyleSheet.create({
    toolbar: {
      position: 'absolute',
      bottom: showSelectionbar === 'top' ? 0 : undefined,
      top: showSelectionbar === 'bottom' ? 0 : undefined,
      backgroundColor: theme.background,
      left: 0,
      padding: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      height: theme.size + 8,
      width: '100%',
    },
  });
