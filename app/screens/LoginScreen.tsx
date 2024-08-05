import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("MainTabs"); // Make sure this matches your stack navigator name
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../assets/images/logo-copy.png")} style={styles.logo} />
        <Text style={styles.title}>Welcome to Preto</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#FFD700"
        accessibilityLabel="Email input field"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#FFD700"   
          accessibilityLabel="Password input field"
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      {isLoading && (
        <ActivityIndicator size="small" color="#FFD700" style={styles.activityIndicator} />
      )}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signupSection}>
        <Text style={styles.link}>Don&#39;t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => Alert.alert("Forgot Password", "Password reset instructions sent.")}
      >
        <Icon name="lock-closed-outline" size={20} color="#FFD700" />
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 10,
  },
  buttonText: {
    color: "#000", 
    fontSize: 18,
    fontWeight: "bold", 
  },
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  eyeIcon: {
    position: "absolute", 
    right: 10,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#FFD700",
    marginLeft: 5,
    textDecorationLine: "none",
  },
  header: {
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#000",
    borderColor: "#FFD700",
    borderRadius: 8,
    borderWidth: 1,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    textAlign: "left",
    width: "100%",
  },
  link: {
    color: "#FFD700",
    marginBottom: 5,
    textDecorationLine: "none",
  },
  loginButton: {
    alignItems: "center",   
    backgroundColor: "#FFD700",
    borderRadius: 8,
    marginTop: 20,
    padding: 15,
    width: "100%",
  },
  logo: {
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
    width: 100,  
  },
  passwordContainer: {   
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  signupLink: {
    color: "#FFD700",
    fontWeight: "bold",
    textDecorationLine: "none",
  },
  signupSection: {
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    color: "#FFD700",
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
});

export default LoginScreen;





