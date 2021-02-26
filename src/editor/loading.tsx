import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  text: string;
};

export const Loading: React.FC<Props> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
