import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CallsScreen = ({ navigation }) => {
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCalls = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const callsRef = collection(db, 'calls');
      let q = query(callsRef, where('userIds', 'array-contains', currentUser.uid));

      if (filter === 'missed') {
        q = query(callsRef, where('status', '==', 'missed'), where('userIds', 'array-contains', currentUser.uid));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedCalls = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCalls(fetchedCalls);
      }, (error) => {
        console.error("Error fetching calls: ", error);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchCalls();
    return () => unsubscribe && unsubscribe();
  }, [filter]);

  const renderCallItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.callItem} 
      onPress={() => navigation.navigate('NewCallScreen', { receiverId: item.receiverId })}
    >
      <Image source={{ uri: item.receiverAvatar }} style={styles.avatar} />
      <View style={styles.callInfo}>
        <Text style={styles.callText}>{item.receiverName}</Text>
        <Text style={styles.callTimestamp}>
          {new Date(item.timestamp).toLocaleString()} - {item.duration || 'N/A'}
        </Text>
      </View>
      <View style={styles.callAction}>
        {item.type === 'incoming' ? (
          <Ionicons name="call" size={24} color="#FFD700" />
        ) : (
          <MaterialIcons name="call-made" size={24} color="#FFD700" />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    // Handle user search logic here
    Alert.alert('Search', `Search for user: ${searchQuery}`);
  };

  const handleCall = () => {
    // Handle initiating a new call here
    Alert.alert('Call', 'Initiate a new call');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recent Calls</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setFilter('all')}>
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('missed')}>
            <Text style={[styles.filterText, filter === 'missed' && styles.filterTextActive]}>Missed</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={calls}
        renderItem={renderCallItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.callButton} onPress={() => navigation.navigate('NewCallScreen')}>
        <Ionicons name="call" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterText: {
    color: '#999',
    fontSize: 16,
    marginLeft: 10,
  },
  filterTextActive: {
    color: '#FFD700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 10,
    color: '#FFF',
  },
  searchButton: {
    marginLeft: 10,
  },
  list: {
    padding: 10,
  },
  callItem: {
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
  callInfo: {
    flex: 1,
  },
  callText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callTimestamp: {
    color: '#ccc',
    fontSize: 14,
  },
  callAction: {
    padding: 5,
  },
  callButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    padding: 15,
  },
});

export default CallsScreen;
