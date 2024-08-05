
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { db, auth, storage } from "../firebase/config";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [postContent, setPostContent] = useState("");
  const [mediaUri, setMediaUri] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserDetails(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePost = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      let mediaUrl = "";
      if (mediaUri) {
        const response = await fetch(mediaUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `${user.uid}/posts/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "posts"), {
        content: postContent,
        mediaUrl,
        userId: user.uid,
        username: userDetails?.username || user.email,
        userImage: userDetails?.userImage || "default-image-url",
        timestamp: Timestamp.fromDate(new Date()),
      });

      setPostContent("");
      setMediaUri("");
      navigation.goBack();
    } catch (error) {
      console.error("Error posting content:", error);
      Alert.alert("Error", "An unexpected error occurred: " + error.message);
    }
  };

  const handleMediaPick = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      setMediaUri(image.path);
    }).catch(error => {
      console.error("ImagePicker Error:", error);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={28} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a Post</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TextInput  
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#888"
          multiline
          value={postContent}
          onChangeText={setPostContent}
        />
        {mediaUri ? (
          <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
        ) : null}
        <View style={styles.mediaButtonsContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={handleMediaPick}>
            <FontAwesome name="photo" size={24} color="#FFD700" />
            <Text style={styles.mediaButtonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <FontAwesome name="video-camera" size={24} color="#FFD700" />
            <Text style={styles.mediaButtonText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <FontAwesome name="music" size={24} color="#FFD700" />
            <Text style={styles.mediaButtonText}>Audio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};
          
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  headerContainer: {
    alignItems: "center",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerRight: {
    width: 28,
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 10,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
    padding: 15,
    textAlignVertical: "top",
  },
  mediaButton: {
    alignItems: "center",
  },
  mediaButtonText: {
    color: "#FFD700",
    fontSize: 12,
    marginTop: 5,
  },
  mediaButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    marginTop: 15,
  },
  mediaPreview: {
    borderRadius: 10,
    height: 200,
    marginTop: 10,
    width: "100%",
  },
  postButton: {
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 10,
    margin: 15,
    paddingVertical: 15,  
  },
  postButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",  
  },
});
    
export default CreatePostScreen;
