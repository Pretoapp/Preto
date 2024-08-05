
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ChatNavigator from "./ChatNavigator";
import HubScreen from "../screens/HubScreen";
import CallsScreen from "../screens/CallsScreen";
import VideosScreen from "../screens/VideosScreen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Chat") {
            iconName = "chatbubbles-outline";
          } else if (route.name === "Hub") {
            iconName = "albums-outline"; 
          } else if (route.name === "Calls") {
            iconName = "call-outline";
          } else if (route.name === "Videos") {
            iconName = "videocam-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFFF00",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#000" },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatNavigator} />
      <Tab.Screen name="Hub" component={HubScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
