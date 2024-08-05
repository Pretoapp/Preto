import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const UserSuggestions: React.FC = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() =>
        navigation.navigate('Profile', { userId: item.id === currentUser?.uid ? 'self' : item.id })
      }
    >
      <Image source={{ uri: item.profileImage }} style={styles.userImage} />
      <Text style={styles.userName}>{item.name}</Text>
      {item.likes && <Text style={styles.userLikes}>Likes: {item.likes.join(', ')}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Users</Text>
      <FlatList
        horizontal
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  title: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  userContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userImage: {
    borderColor: '#FFD700',
    borderRadius: 35,
    borderWidth: 2,
    height: 70,
    width: 70,
  },
  userName: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  userLikes: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
});

export default UserSuggestions;


