import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const NewChatScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, 'users'),
        where('uid', '!=', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedContacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(fetchedContacts);
      });

      return () => unsubscribe();
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() =>
        navigation.navigate('ChatDetailScreen', {
          receiverId: item.uid,
          userName: item.name,
          userProfilePicture: item.profilePicture,
        })
      }
    >
      <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>{item.status || 'Hey there! I am using Preto'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Chat</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactStatus: {
    color: '#888',
    fontSize: 14,
  },
});

export default NewChatScreen;

