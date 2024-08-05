import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export const startChat = async (receiverId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("userIds", "array-contains", currentUser.uid));

  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.userIds.includes(receiverId);
  });

  if (existingChat) return existingChat.id;

  const newChat = await addDoc(chatsRef, {
    userIds: [currentUser.uid, receiverId],
    userNames: [currentUser.displayName, receiverId], // Adjust based on your schema
  });

  return newChat.id;
};

export const sendMessage = async (chatId: string, text: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  const newMessage = {
    text,
    senderId: currentUser.uid,
    senderName: currentUser.displayName || "You",
    senderProfilePicture: currentUser.photoURL || undefined,
    timestamp: new Date().toISOString(),
    reactions: [],
    read: false,
    type: "text",
    recipientId: "",
  };

  await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
};

