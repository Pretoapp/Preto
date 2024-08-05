import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

const RepostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [repostComment, setRepostComment] = useState('');

  const handleRepost = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'posts'), {
          originalPostId: postId,
          repostComment: repostComment,
          userId: user.uid,
          username: user.displayName,
          timestamp: new Date(),
        });
        Alert.alert("Success", "Repost created successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating repost:", error);
      Alert.alert("Error", "Failed to create repost");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add a comment to your repost:</Text>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        placeholderTextColor="#888"
        value={repostComment}
        onChangeText={setRepostComment}
      />
      <Button title="Repost" onPress={handleRepost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default RepostScreen;

