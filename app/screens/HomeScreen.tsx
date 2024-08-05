import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  StatusBar,
  RefreshControl,
} from "react-native";
import _ from "lodash";
import TopBar from "../components/TopBar";
import Post from "../components/Post";
import Separator from "../components/Separator";
import Tabs from "../components/Tabs";
import { updateLikeCount } from "../utils/utils";
import FeedHeader from "../components/FeedHeader";
import StoryHighlights from "../components/StoryHighlights";
import UserSuggestions from "../components/UserSuggestions";
import { auth, db } from "../firebase/config";
import { collection, query, onSnapshot, orderBy, limit, getDoc, doc } from "firebase/firestore";
import StoryModal from "../components/StoryModal";
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<any, 'HomeScreen'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Feed");
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loadPostsRealTime();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUserProfile(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching current user profile:", error);
      }
    };

    fetchCurrentUserProfile();
  }, []);

  const loadPostsRealTime = () => {
    setIsLoading(true);
    setError("");

    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(20));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toString() : new Date().toString(),
        };
      });

      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
      setIsLoading(false);
      setHasMore(fetchedPosts.length > 0);
    }, (error) => {
      console.error("Error loading posts in real-time:", error);
      setError("Failed to load data. Please try again later.");
      setIsLoading(false);
    });

    return unsubscribe;
  };

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      const lowerCaseQuery = query.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.username.toLowerCase().includes(lowerCaseQuery) ||
            post.content.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }, 300),
    [posts]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleEndReached = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setPosts([]);
    const unsubscribe = loadPostsRealTime();
    setRefreshing(false);
    return () => unsubscribe();
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = (post) => {
    navigation.navigate('EditPostScreen', { post });
  };

  const handleAddStory = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (isLoading && page === 1) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TopBar navigation={navigation} profileImageUrl={currentUserProfile?.profileImage || "https://via.placeholder.com/50"} />
      <FeedHeader navigation={navigation} />
      <StoryHighlights onAddStory={handleAddStory} />
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <View style={styles.contentContainer}>
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => (
            <>
              <Post
                post={item}
                currentUser={auth.currentUser}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                onLike={() => updateLikeCount(item.id, setPosts)}
                onComment={() => navigation.navigate("CommentScreen", { postId: item.id })}
                onRepost={() => navigation.navigate("RepostScreen", { postId: item.id })}
              />
              <Separator />
            </>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsContainer}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#FFD700" />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFD700" />
          }
        />
        <UserSuggestions navigation={navigation} />
      </View>
      <StoryModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#000",
    flex: 1,
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    color: "#FFD700",
    fontSize: 18,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  postsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default HomeScreen;
