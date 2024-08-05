import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';
import { collection, addDoc, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';

const CommentScreen = ({ route }) => {
  const { postId } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComments = () => {
      const commentsQuery = query(
        collection(db, 'posts', postId, 'comments'),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        const commentsArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            timestamp: data.timestamp?.toDate().toString() || new Date().toString()
          };
        });

        setComments(commentsArray);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchComments();
    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        await addDoc(collection(db, 'posts', postId, 'comments'), {
          text: comment,
          userId: user.uid,
          username: userData.username,
          timestamp: new Date()
        });
        setComment('');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.username}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        placeholderTextColor="#888"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Submit" onPress={handleCommentSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  commentItem: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentUser: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  commentText: {
    color: '#FFF',
  },
  commentTimestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CommentScreen;

