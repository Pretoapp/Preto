import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { firebase } from "../firebase/firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Error", "You must agree to the terms and conditions to sign up");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      await firebase.firestore().collection("users").doc(user.uid).set({
        username,
        name,
        email,
        userId: user.uid,
      });

      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#FFD700"
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#FFD700"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#FFD700"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#FFD700"
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        placeholderTextColor="#FFD700"
      />
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)}>
          <Icon name={agreeTerms ? "checkbox" : "square-outline"} size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.termsText} onPress={() => setTermsModalVisible(true)}>
          I agree to the Terms and Conditions (tap to view)
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFD700" />
        ) : (
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView>
              <Text style={styles.modalText}>
                {/* Insert your terms and conditions text here */}
              </Text>
            </ScrollView>
            <Button title="Close" onPress={() => setTermsModalVisible(false)} color="#FFD700" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#FFD700",
    color: "#FFF",
    marginBottom: 15,
    fontSize: 16,
    textAlign: "left",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  termsText: {
    color: "#FFD700",
    textDecorationLine: "none",
    marginLeft: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  signUpButton: {
    backgroundColor: "#FFD700",
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#FFD700",
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  modalTitle: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default SignUpScreen;









