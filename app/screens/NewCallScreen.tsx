
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';

type NewCallScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewCallScreen'>;
type NewCallScreenRouteProp = RouteProp<RootStackParamList, 'NewCallScreen'>;

interface NewCallScreenProps {
  navigation: NewCallScreenNavigationProp;
  route: NewCallScreenRouteProp;
}

const NewCallScreen: React.FC<NewCallScreenProps> = ({ route, navigation }) => {
  const { callId } = route.params || { callId: 'No call ID provided' };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calling... {callId}</Text>
      <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
        <Ionicons name="call" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 50,
    padding: 20,
  },
});

export default NewCallScreen;
