import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const { width, height } = Dimensions.get('window');

const ViewStoryScreen = ({ navigation, route }) => {
  const { storyUserId } = route.params;
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      const q = query(
        collection(db, 'stories'),
        where('userId', '==', storyUserId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedStories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(fetchedStories);
      });

      return () => unsubscribe();
    };

    fetchStories();
  }, [storyUserId]);

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStoryItem = ({ item }) => (
    <View style={styles.storyContainer}>
      <Image source={{ uri: item.media }} style={styles.storyImage} />
    </View>
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={flatListRef}
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.control} onPress={handlePreviousStory} />
        <TouchableOpacity style={styles.control} onPress={handleNextStory} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stories</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  controlsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  control: {
    width: '50%',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ViewStoryScreen;

