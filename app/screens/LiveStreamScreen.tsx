// app/screens/LiveStreamScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LiveStreamScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Live Stream Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default LiveStreamScreen;

