import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Alert, Modal, TextInput } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Video from "react-native-video";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import moment from "moment";
import CommentsModal from "./CommentsModal";
import EditPostModal from "./EditPostModal";

interface PostData {
  id: string;
  userImage: string;
  username: string;
  timestamp: string;
  userId: string;
  content: string;
  type: "text" | "image" | "video";
  likes: number;
  reposts: number;
  mediaUrl?: string;
}

interface User {
  uid: string;
  image: string;
  name: string;
}

interface PostProps {
  post: PostData;
  currentUser: User;
  onDelete: (postId: string) => void;
  onLike: () => void;
  onRepost: () => void;
}

const Post: React.FC<PostProps> = ({ post, currentUser, onDelete, onLike, onRepost }) => {
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");

  const animatedValue = new Animated.Value(0);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", post.id));
      onDelete(post.id);
      Alert.alert("Success", "Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post: ", error);
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const handleEdit = () => {
    setModalVisible(false);
    setEditModalVisible(true);
  };

  const handleImagePress = () => {
    setImageModalVisible(true);
  };

  const handleCreatePost = (text: string, image?: string) => {
    // Handle post creation logic here
  };

  const handlePostSubmit = () => {
    // Handle post submission logic here
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.userImage }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
        </View>
        {currentUser.uid === post.userId && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Entypo name="dots-three-horizontal" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.contentContainer}>
        {post.type === "video" ? (
          <Video source={{ uri: post.mediaUrl }} style={styles.postContent} controls resizeMode="cover" />
        ) : post.type === "image" ? (
          <TouchableOpacity onPress={handleImagePress}>
            <Image source={{ uri: post.mediaUrl }} style={styles.postImage} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.postText}>{post.content}</Text>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleLike}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.actionButton}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Entypo name="heart" size={24} color={liked ? "red" : "#FFD700"} />
            </Animated.View>
            <Text style={[styles.actionText, liked && { color: "red" }]}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.actionButton}>
            <Entypo name="message" size={24} color="#FFD700" />
            <Text style={styles.actionText}>{comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRepost} style={styles.actionButton}>
            <Entypo name="share" size={24} color="#FFD700" />
            <Text style={styles.actionText}>{post.reposts}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        postId={post.id}
        currentUser={currentUser}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Write a post..."
              placeholderTextColor="#888"
              value={postContent}
              onChangeText={setPostContent}
            />
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={() => setPostType("text")}>
                <Text style={styles.optionText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setPostType("image")}>
                <Text style={styles.optionText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setPostType("video")}>
                <Text style={styles.optionText}>Video</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handlePostSubmit} style={styles.postButton}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <EditPostModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onPost={handleCreatePost}
      />
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.closeButton}>
            <Entypo name="cross" size={30} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: post.mediaUrl }} style={styles.fullscreenImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 15,
  },
  actionText: {
    color: "#FFD700",
    marginLeft: 5,
  },
  actions: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#111",
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  contentContainer: {
    marginBottom: 10,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  modalButton: {
    marginVertical: 10,
  },
  modalButtonText: {
    color: "#FFD700",
    fontSize: 18,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 15,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#111',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  optionText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    width: '100%',
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
  postContent: {
    borderRadius: 15,
    height: 200,
    width: "100%",
  },
  postImage: {
    borderRadius: 15,
    height: 300,
    width: "100%",
    marginVertical: 10,
  },
  postText: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
  },
  timestamp: {
    color: "#AAA",
    fontSize: 12,
  },
  userImage: {
    borderColor: "#FFD700",
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    marginRight: 10,
    width: 40,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  fullscreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default Post;







