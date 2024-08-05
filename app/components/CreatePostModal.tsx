import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const CreatePostModal = ({ visible, onClose, onCreatePost }) => {
  const [content, setContent] = useState('');

  const handleCreatePost = () => {
    onCreatePost(content);
    setContent('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreatePost} style={styles.button}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default CreatePostModal;

