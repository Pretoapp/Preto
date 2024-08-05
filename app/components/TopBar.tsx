import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/AppNavigator'; // Adjust the path to your navigator file

type TopBarNavigationProp = StackNavigationProp<RootStackParamList>;

interface TopBarProps {
  navigation: TopBarNavigationProp;
  profileImageUrl: string; // Add this line
}

const TopBar: React.FC<TopBarProps> = ({ navigation, profileImageUrl }) => { // Add profileImageUrl to the props
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Image
          source={{ uri: profileImageUrl }} // Use profileImageUrl here
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={28} color="#FFFF00" />
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
          <Entypo name="plus" size={28} color="#FFFF00" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={28} color="#FFFF00" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Ionicons name="notifications-outline" size={28} color="#FFFF00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    borderBottomColor: "#FFFF00",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    borderColor: "#FFFF00",
    borderRadius: 17.5,
    borderWidth: 2,
    height: 35,
    width: 35,
  },
  rightContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
  },
});

export default TopBar;

