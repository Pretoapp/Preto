// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Alert, ScrollView, ActivityIndicator, Platform, PermissionsAndroid, FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db, storage } from '../firebase/config';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Post from '../components/Post';
import CreatePostModal from '../components/CreatePostModal';

const ProfileScreen = ({ route, navigation }) => {
  const initialProfileData = {
    username: "",
    name: "",
    bio: "",
  };

  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [bannerImage, setBannerImage] = useState("https://via.placeholder.com/400x200");
  const [statusMessage, setStatusMessage] = useState("Welcome to my profile!");
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileData(userData);
            if (userData.profileImage) setProfileImage(userData.profileImage);
            if (userData.bannerImage) setBannerImage(userData.bannerImage);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const user = auth.currentUser;
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsArray = querySnapshot.docs.map(doc => {
          const postData = doc.data();
          return {
            ...postData,
            id: doc.id,
            timestamp: postData.timestamp ? postData.timestamp.toDate().toString() : new Date().toString() // Convert timestamp to string
          };
        }).filter(post => post.userId === user.uid); // Filter posts by user
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
        Alert.alert("Error", "Failed to load posts");
      }
    };

    fetchUserData();
    fetchPosts();
  }, [route.params?.updatedProfileData]);

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to make this work!');
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Permissions granted");
        } else {
          console.log("Permissions denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const uploadImage = async (uri, type) => {
    const user = auth.currentUser;
    if (!user) return;

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `${user.uid}/${type}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const pickImage = async (type) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelled');
      } else if (response.error) {
        Alert.alert('Error', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        const downloadURL = await uploadImage(source.uri, type);

        if (type === 'profile') {
          setProfileImage(downloadURL);
          await updateProfileData({ profileImage: downloadURL });
        } else {
          setBannerImage(downloadURL);
          await updateProfileData({ bannerImage: downloadURL });
        }
      }
    });
  };

  const updateProfileData = async (data) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), data);
      setProfileData(prevData => ({ ...prevData, ...data }));
    } catch (error) {
      console.error("Error updating profile data:", error);
      Alert.alert("Error", "Failed to update profile data");
    }
  };

  const followCommunities = () => {
    Alert.alert("Follow Communities", "Feature to follow communities will be implemented here.");
  };

  const addFriends = () => {
    Alert.alert("Add Friends", "Feature to add friends will be implemented here.");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = (post) => {
    navigation.navigate('EditPostScreen', { post });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <>
        <TouchableOpacity onPress={() => pickImage("banner")}>
          <ImageBackground source={{ uri: bannerImage }} style={styles.backgroundImage}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconLeft}>
                <Entypo name="chevron-left" size={28} color="#FFD700" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.headerIconRight}>
                <Entypo name="dots-three-vertical" size={28} color="#FFD700" />
              </TouchableOpacity>
            </View>
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity onPress={() => pickImage("profile")}>
                <Image source={{ uri: profileImage }} style={styles.profilePicture} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editProfileButton} onPress={() => pickImage("profile")}>
                <Entypo name="camera" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Settings'); }}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Help'); }}>
              <Text style={styles.menuItemText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert('Share Profile', 'Profile shared!'); }}>
              <Text style={styles.menuItemText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.profileInfoSection}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.statusMessage}>{profileData.bio}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { profileData })}>
            <Text style={styles.profileInfoLink}>Edit Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton} onPress={() => setIsModalVisible(true)}>
            <Entypo name="plus" size={16} color="#000" />
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.startSection}>
          <Text style={styles.sectionTitle}>Where do I start?</Text>
          <View style={styles.startOptions}>
            <TouchableOpacity style={styles.optionCard} onPress={() => pickImage("profile")}>
              <Entypo name="camera" size={28} color="#FFD700" />
              <Text style={styles.optionText}>Add a profile photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionCard} onPress={followCommunities}>
              <Entypo name="users" size={28} color="#FFD700" />
              <Text style={styles.optionText}>Follow communities</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.friendsSection}>
          <Text style={styles.friendsText}>You haven't added any friends yet</Text>
          <TouchableOpacity style={styles.addButton} onPress={addFriends}>
            <Text style={styles.addButtonText}>Add Friends</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <Text style={styles.tab}>Photos</Text>
          <Text style={styles.tab}>Videos</Text>
          <Text style={styles.tab}>Clips</Text>
          <Text style={styles.tab}>Narrative</Text>
        </View>

        <View style={styles.noContentSection}>
          <Text style={styles.noContentText}>You haven't uploaded any photos yet</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Post
              post={item}
              currentUser={auth.currentUser}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              onLike={() => console.log("Liked post", item.id)}
              onComment={() => console.log("Comment on post", item.id)}
              onRepost={() => console.log("Reposted post", item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#FFD700" />}
        />

        <CreatePostModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          navigation={navigation}
        />
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 30,
    marginTop: 30,
    position: "relative",
  },
  headerIconLeft: {
    position: "absolute",
    left: -185,
    top: 50,
  },
  headerIconRight: {
    position: "absolute",
    right: -185,
    top: 50,
  },
  backgroundImage: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 105,
    height: 105,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 120,
    borderWidth: 4,
    borderColor: "#000",
    position: "relative",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 5,
  },
  profileInfoSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  profileName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  statusMessage: {
    color: "#FFD700",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  profileInfoLink: {
    color: "#00ADEF",
    fontSize: 14,
    marginBottom: 10,
  },
  postButton: {
    flexDirection: "row",
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  postButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  startSection: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  startOptions: {
    flexDirection: "row",
  },
  optionCard: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  optionText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  friendsSection: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopColor: "#FFD700",
    borderTopWidth: 1,
    borderBottomColor: "#FFD700",
    borderBottomWidth: 1,
  },
  friendsText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#111",
    borderBottomColor: "#FFD700",
    borderBottomWidth: 1,
  },
  tab: {
    color: "#FFD700",
    fontSize: 16,
  },
  noContentSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noContentText: {
    color: "#FFF",
    fontSize: 16,
  },
  postsSection: {
    padding: 20,
  },
  postCard: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  postText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  menu: {
    position: 'absolute',
    right: 15,
    top: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItemText: {
    color: '#FFD700',
    fontSize: 16,
  },
});

export default ProfileScreen;

