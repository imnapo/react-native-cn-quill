import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import type { ToggleData, ToolbarTheme } from "../../types";
import { useToolbar } from "./toolbar-context";

interface Props {
  name: string;
  items: Array<ToggleData>;
  style: any;
  source: any;
}

export const TextListButton: React.FC<Props> = ({ name, items, style }) => {
  const { theme, show, hide, open, selectionName, getSelected } = useToolbar();
  const styles = makeStyles(theme);

  const showMenu = () => {
    if (open && selectionName === name) hide();
    else show(name, items);
  };

  const selectedValue = getSelected(name);
  const selectedItem = items.find((x) => x.valueOn === selectedValue);
  const isOpen = selectionName === name;

  return (
    <TouchableOpacity onPress={showMenu}>
      <View style={[styles.tool, style]}>
        {selectedItem?.source ? (
          <Image source={selectedItem.source} style={[styles.image]} />
        ) : (
          <Text style={styles.text}>
            {selectedItem ? selectedItem.name : name}
          </Text>
        )}
        {isOpen && <View style={[styles.overlay]} />}
      </View>
    </TouchableOpacity>
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
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      marginRight: 4,
      marginLeft: 4,
      height: Math.round(theme.size),
    },
    image: {
      height: Math.round(theme.size * 0.6),
      width: Math.round(theme.size * 0.6),
      tintColor: theme.color,
    },
    text: {
      color: theme.color,
      fontWeight: "bold",
    },
  });
