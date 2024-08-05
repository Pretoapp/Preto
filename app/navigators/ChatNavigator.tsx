// app/navigators/ChatNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import NewChatScreen from "../screens/NewChatScreen";

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="NewChat" component={NewChatScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;

