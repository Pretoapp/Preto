// app/components/StoryModal.tsx

import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface StoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://via.placeholder.com/350' }} // Replace with the story image URL
          style={styles.storyImage}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
});

export default StoryModal;

