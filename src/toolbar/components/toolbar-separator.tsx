import React from 'react';
import { View, StyleSheet } from 'react-native';

const defaultColor = '#737373';

interface Props {
  color: string;
}

export const ToolbarSeparator: React.FC<Props> = ({ color }) => {
  return (
    <View
      style={[styles.separator, { backgroundColor: color || defaultColor }]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    width: 1,
    marginTop: 4,
    marginBottom: 4,
  },
});
