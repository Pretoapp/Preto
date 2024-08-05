import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface EditPostModalProps {
  visible: boolean;
  onClose: () => void;
  onPost: (text: string, image?: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ visible, onClose, onPost }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handlePost = () => {
    if (text || image) {
      onPost(text, image || undefined);
      setText('');
      setImage(null);
      onClose();
    } else {
      Alert.alert("Error", "Please add text or image before posting");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#AAA"
            multiline
            value={text}
            onChangeText={setText}
          />
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Text style={styles.buttonText}>Add Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePost} style={styles.button}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: 'gray' }]}>
              <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#191015',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#FFF',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default EditPostModal;


