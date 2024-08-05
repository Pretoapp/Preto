import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("user1")
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("This is my bio")

  const saveProfile = () => {
    // Save profile changes logic here
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        placeholderTextColor="#999"
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default EditProfileScreen

