import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import CommentScreen from "../screens/CommentScreen";
import RepostScreen from "../screens/RepostScreen";
import NotificationScreen from "../screens/NotificationScreen";
import LiveStreamScreen from "../screens/LiveStreamScreen";
import MainTabNavigator from "./MainTabNavigator";
import ChatNavigator from "./ChatNavigator";
import CreatePostScreen from "../screens/CreatePostScreen";
import CallsScreen from "../screens/CallsScreen";
import NewCallScreen from "../screens/NewCallScreen";
import NewVideoCallScreen from "../screens/NewVideoCallScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen"; 
import CreateStoryScreen from "../screens/CreateStoryScreen";
import NewChatScreen from "../screens/NewChatScreen"; 
import ViewStoryScreen from "../screens/ViewStoryScreen";
import { RootStackParamList } from "../navigators/AppNavigator";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
      <Stack.Screen name="RepostScreen" component={RepostScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="LiveStreamScreen" component={LiveStreamScreen} />
      <Stack.Screen name="Chat" component={ChatNavigator} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="CallsScreen" component={CallsScreen} />
      <Stack.Screen name="NewCallScreen" component={NewCallScreen} />
      <Stack.Screen name="NewVideoCallScreen" component={NewVideoCallScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
      <Stack.Screen name="CreateStoryScreen" component={CreateStoryScreen} />
      <Stack.Screen name="NewChatScreen" component={NewChatScreen} /> 
      <Stack.Screen name="ViewStoryScreen" component={ViewStoryScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
