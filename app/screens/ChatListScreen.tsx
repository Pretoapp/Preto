import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('userIds', 'array-contains', currentUser.uid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedChats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChats(fetchedChats);
      }, (error) => {
        console.error("Error fetching chats: ", error);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchChats();
    return () => unsubscribe && unsubscribe();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => navigation.navigate('ChatDetailScreen', { chatId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatText}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default ChatListScreen;

