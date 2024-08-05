import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../firebase/config';
import { collection, addDoc, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  currentUser: any;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose, postId, currentUser }) => {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Comments</Text>
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
          <TouchableOpacity onPress={handleCommentSubmit} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
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
    marginTop: 10,
  },
  postButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFD700',
  },
});

export default CommentsModal;



