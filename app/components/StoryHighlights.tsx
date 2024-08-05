import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";

const StoryHighlights: React.FC = () => {
  const [stories, setStories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStories = async () => {
      const storiesCollection = collection(db, "stories");
      const storiesSnapshot = await getDocs(storiesCollection);
      const storiesList = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(storiesList);
    };

    fetchStories();
  }, []);

  const renderStory = ({ item }) => (
    <TouchableOpacity style={styles.storyContainer} onPress={() => navigation.navigate("ViewStory", { storyId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={styles.storyUser}>{item.user}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        horizontal
        data={stories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addStoryContainer} onPress={() => navigation.navigate("CreateStory")}>
            <View style={styles.addStoryImageContainer}>
              <Text style={styles.addStoryText}>+</Text>
            </View>
            <Text style={styles.storyUser}>Your Story</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  storyImage: {
    borderColor: "#FFD700",
    borderRadius: 50,
    borderWidth: 2,
    height: 70,
    width: 70,
  },
  storyUser: {
    color: "#FFF",
    fontFamily: "sans-serif",
    fontSize: 12,
    marginTop: 5,
  },
  addStoryContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  addStoryImageContainer: {
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderRadius: 50,
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  addStoryText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default StoryHighlights;

