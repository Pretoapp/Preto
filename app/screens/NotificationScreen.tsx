import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';


const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotifications(prev => [...prev, remoteMessage]);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.messageId}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{item.notification.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notification: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  notificationText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default NotificationScreen;

