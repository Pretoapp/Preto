import React from "react"
import { View, StyleSheet } from "react-native"

const FeedHeader: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Add additional elements for the header if needed */}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: "#FFD700",
    borderBottomWidth: 1,
  },
})

export default FeedHeader

