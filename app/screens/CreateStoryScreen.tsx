import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const CreateStoryScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const postStory = async () => {
    if (selectedImage && caption.trim() !== '') {
      const currentUser = auth.currentUser;
      const newStory = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userProfilePicture: currentUser.photoURL || '',
        imageUrl: selectedImage,
        caption,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'stories'), newStory);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Story</Text>
          <TouchableOpacity onPress={postStory}>
            <Ionicons name="checkmark" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="image-outline" size={100} color="#FFF" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Add a caption..."
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    backgroundColor: '#333',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 10,
    padding: 10,
    height: 40,
  },
});

export default CreateStoryScreen;

