import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
type Props = {
  style?: StyleProp<ViewStyle>;
};
export const CustomContainer: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[style]} onTouchStart={(e) => e.stopPropagation()}>
      {children}
    </View>
  );
};
