


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Image,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigators/AppNavigator";
import { startChat, sendMessage as sendChatMessage } from "../services/chatService"; // Import the new chatService

type ChatDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChatDetailScreen"
>;

type ChatDetailScreenRouteProp = RouteProp<RootStackParamList, "ChatDetailScreen">;

interface ChatDetailScreenProps {
  route: ChatDetailScreenRouteProp;
  navigation: ChatDetailScreenNavigationProp;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderProfilePicture?: string;
  timestamp: string;
  reactions: string[];
  read: boolean;
  type: "text" | "voice" | "image" | "video";
  uri?: string;
  recipientId: string;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ route, navigation }) => {
  const { receiverId, userName, userProfilePicture } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const currentUser = auth.currentUser;
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatId = async () => {
      if (currentUser && receiverId) {
        const chatId = await startChat(receiverId);
        setChatId(chatId);
      }
    };

    fetchChatId();
  }, [currentUser, receiverId]);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Message)).reverse();
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnimation, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping, typingAnimation]);

  const sendMessage = async () => {
    if (inputText.trim() !== "" && chatId) {
      await sendChatMessage(chatId, inputText);
      setInputText("");
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording && currentUser && receiverId) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          const newMessage: Omit<Message, "id"> = {
            text: "Voice message",
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "You",
            timestamp: new Date().toISOString(),
            reactions: [],
            read: false,
            type: "voice",
            uri: uri,
            recipientId: receiverId,
          };

          if (currentUser.photoURL) {
            newMessage.senderProfilePicture = currentUser.photoURL;
          }

          await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
          setRecording(null);
        }
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const selectMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0 && currentUser && receiverId) {
      const asset = result.assets[0];
      const type = asset.type?.startsWith("video") ? "video" : "image";
      const newMessage: Omit<Message, "id"> = {
        text: type === "video" ? "Video message" : "Image message",
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "You",
        senderProfilePicture: currentUser.photoURL || undefined,
        timestamp: new Date().toISOString(),
        reactions: [],
        read: false,
        type,
        uri: asset.uri,
        recipientId: receiverId,
      };
      await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
    }
  };

  const playRecording = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === currentUser?.uid ? styles.messageBubbleRight : styles.messageBubbleLeft,
      ]}
    >
      {item.type === "text" && <Text style={styles.messageText}>{item.text}</Text>}
      {item.type === "voice" && (
        <TouchableOpacity onPress={() => item.uri && playRecording(item.uri)}>
          <View style={styles.voiceMessageContainer}>
            <MaterialCommunityIcons name="play" size={24} color="#FFF" />
            <Text style={styles.voiceMessageText}>Voice message</Text>
          </View>
        </TouchableOpacity>
      )}
      {(item.type === "image" || item.type === "video") && item.uri && (
        <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
      )}
      <Text style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      {item.read && <Ionicons name="checkmark-done" size={16} color="#007AFF" />}
    </View>
  );

  const renderRecordButton = () =>
    recording ? (
      <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
        <MaterialCommunityIcons name="stop" size={24} color="#FFF" />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
        <MaterialCommunityIcons name="microphone" size={24} color="#FFF" />
      </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerUserInfo}>
            <Image source={{ uri: userProfilePicture }} style={styles.userImage} />
            <Text style={styles.headerTitleText}>{userName}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => console.log("Initiate call")}
              style={styles.headerButton}
            >
              <Ionicons name="call" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log("Initiate video call")}
              style={styles.headerButton}
            >
              <Ionicons name="videocam" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        />
        {isTyping && (
          <Animated.View style={[styles.typingIndicator, { opacity: typingAnimation }]}>
            <Text style={styles.typingText}>Typing...</Text>
          </Animated.View>
        )}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={selectMedia}>
            <MaterialCommunityIcons name="plus" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          {renderRecordButton()}
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialCommunityIcons name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  headerButton: {
    padding: 5,
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitleText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
  },
  messageList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  messageBubbleLeft: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  messageBubbleRight: {
    backgroundColor: "#FFD700",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  messageTextLeft: {
    color: "#FFF",
    fontSize: 16,
  },
  messageTextRight: {
    color: "#000",
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1C1C1E",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#FFF",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
  },
  mediaButton: {
    marginRight: 10,
  },
  recordButton: {
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  typingIndicator: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 20,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
  },
  typingText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  voiceMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voiceMessageText: {
    marginLeft: 10,
    color: "#FFF",
  },
  mediaPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  separator: {
    height: 0, // Set height to 0 to remove the separator
  },
});

export default ChatDetailScreen
