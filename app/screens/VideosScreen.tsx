import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const VideosScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const videosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videosList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos: ", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoItem}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.channel}>{item.channelName}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      renderItem={renderVideoItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#000',
  },
  videoItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  videoInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channel: {
    color: '#AAA',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default VideosScreen;

