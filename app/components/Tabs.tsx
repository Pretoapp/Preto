import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Tabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.container}>
      {['Feed', 'For You', 'News'].map((tab) => (
        <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
          <Text style={[styles.tab, selectedTab === tab && styles.selectedTab]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  tab: {
    color: '#888',
    fontSize: 16,
  },
  selectedTab: {
    color: '#FFF',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
});

export default Tabs;

