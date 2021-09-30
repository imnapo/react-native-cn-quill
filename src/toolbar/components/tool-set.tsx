import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListButton } from './list-button';
import { ToggleIconButton } from './toggle-icon-button';
import { ColorListButton } from './color-list-button';
import type { ColorListData, TextListData, ToggleData } from '../../types';
import { formatType } from '../../constants/formats';
import { useToolbar } from './toolbar-context';

interface Props {
  tools: Array<ToggleData | TextListData | ColorListData>;
}

export const ToolSet: React.FC<Props> = (props) => {
  const { tools } = props;
  const { styles } = useToolbar();
  const renderToggle = (index: number, data: ToggleData) => (
    <ToggleIconButton
      key={index}
      name={data.name}
      source={data.source}
      valueOff={data.valueOff}
      valueOn={data.valueOn}
    />
  );

  const renderTextList = (index: number, data: TextListData) => (
    <ListButton key={index} name={data.name} items={data.values} />
  );

  const renderColorList = (index: number, data: ColorListData) => (
    <ColorListButton
      key={index}
      name={data.name}
      items={data.values}
      source={data.source}
    />
  );

  const rootStyle = styles?.toolbar?.toolset?.root
    ? styles.toolbar?.toolset?.root(defaultStyles.toolset)
    : defaultStyles.toolset;

  return (
    <View style={rootStyle}>
      {tools.map((tool, index) => {
        const { type } = tool;
        if (type === formatType.select) {
          return renderTextList(index, tool as TextListData);
        } else if (type === formatType.color) {
          return renderColorList(index, tool as ColorListData);
        } else {
          return renderToggle(index, tool as ToggleData);
        }
      })}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  toolset: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    marginRight: 1,
  },
});
