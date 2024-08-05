import React from "react";
import { View, StyleSheet } from "react-native";

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: "#000",
    marginVertical: 8,
    borderRadius: 0.5,
  },
});

export default Separator;



