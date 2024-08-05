import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define your RootStackParamList here or import it from your navigation types file
type RootStackParamList = {
  HubScreen: undefined;
  History: undefined;
  Art: undefined;
  Music: undefined;
  Literature: undefined;
  Events: undefined;
  // Add other screens here as needed
};

// Define the type for the navigation prop
type HubScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HubScreen'>;

// Define the type for the route prop
type HubScreenRouteProp = RouteProp<RootStackParamList, 'HubScreen'>;

// Define the props for HubScreen
interface HubScreenProps {
  navigation: HubScreenNavigationProp;
  route: HubScreenRouteProp;
}

const HubScreen: React.FC<HubScreenProps> = ({ navigation }) => {
  const categories = [
    { name: 'History', icon: 'book' },
    { name: 'Art', icon: 'color-palette' },
    { name: 'Music', icon: 'musical-notes' },
    { name: 'Literature', icon: 'book-outline' },
    { name: 'Events', icon: 'calendar' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the Hub</Text>
      <Text style={styles.subtitle}>Explore and celebrate black culture</Text>
      
      <Text style={styles.sectionTitle}>Featured</Text>
      <View style={styles.featuredContainer}>
        <TouchableOpacity style={styles.featuredItem}>
          <ImageBackground
            source={require('../../assets/images/black-history-month.jpg')}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.textContainer}>
              <Text style={styles.featuredText}>Celebrating Black History</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.featuredItem}>
          <ImageBackground
            source={require('../../assets/images/spolight.jpg')}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.textContainer}>
              <Text style={styles.featuredText}>Spotlight on Black Artists</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => navigation.navigate(category.name as keyof RootStackParamList)}
          >
            <Ionicons name={category.icon} size={40} color="#FFD700" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    height: 80,
    justifyContent: 'center',
    margin: 10,
    width: 80,
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  featuredItem: {
    borderRadius: 10,
    height: 120,
    marginBottom: 20,
    overflow: 'hidden',
    width: '45%',
  },
  featuredText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginVertical: 10,
  },
  subtitle: {
    color: '#FFD700',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    marginBottom: 10,
    padding: 5,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
  },
});

export default HubScreen;

