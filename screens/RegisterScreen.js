import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import logo from "../assets/logo.png";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { EXPO_PUBLIC_URL } from "@env";
import NotificationModal from "../components/NotificationModal";

const RegisterScreen = () => {
  const auth = FIREBASE_AUTH;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) => {
        const user = userCredential.user;
        axios.post(`${EXPO_PUBLIC_URL}/user`, {
          name: name,
          email: email,
          password: password,
          image: null,
          friendRequests: [],
          friends: [],
          sentFriendRequests: [],
          id: user.uid,
        });
      });
      // Send email verification
      sendEmailVerification(auth.currentUser).then(() => {
        setAlertMessage("Registration successful. Email verification link sent.");
        setShowAlert(true);
        console.log(response);
      });
    } catch (error) {
      setAlertMessage("Registration failed: " + error.message);
        setShowAlert(true);
      console.log("error", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
      <NotificationModal
        message={alertMessage}
        isVisible={showAlert}
        onConfirm={() => setShowAlert(false)}
      />
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={logo}
            style={{ width: 180, height: 100, alignSelf: "center" }}
          />
          <Text
            style={{
              color: "#4A55A2",
              fontSize: 17,
              fontWeight: "600",
              marginTop: 20,
            }}
          >
            Sign Up
          </Text>
        </View>

        <View style={{ marginTop: 40, width: 350 }}>
          <View
            className="signUp-name-input"
            style={{
              borderColor: "gray",
              borderWidth: 0.5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
            }}
          >
            <Icon style={styles.icon} name="account" size={16} color="gray" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: name ? 16 : 16,
                flex: 1,
                padding: 10,
              }}
              placeholder="Name"
            />
          </View>
          <View
            className="signUp-email-input"
            style={{
              borderColor: "gray",
              borderWidth: 0.5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
              marginTop: 20,
            }}
          >
            <Icon style={styles.icon} name="email" size={16} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 16 : 16,
                flex: 1,
                padding: 10,
              }}
              placeholder="Email"
            />
          </View>

          <View
            className="signUp-password-input"
            style={{
              borderColor: "gray",
              borderWidth: 0.5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
              marginTop: 20,
            }}
          >
            <Icon style={styles.icon} name="lock" size={16} color="gray" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                fontSize: password ? 16 : 16,
                flex: 1,
                padding: 10,
              }}
              placeholder="Password"
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={togglePasswordVisibility}>
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={16}
                color="gray"
              />
            </Pressable>
          </View>

          <View
            className="signUp-confirm-password-input"
            style={{
              borderColor: passwordMatchError ? "red" : "gray",
              borderWidth: 0.5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
              marginTop: 20,
            }}
          >
            <Icon style={styles.icon} name="lock" size={16} color="gray" />
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={{
                fontSize: confirmPassword ? 16 : 16,
                flex: 1,
                padding: 10,
              }}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={toggleConfirmPasswordVisibility}>
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={16}
                color="gray"
              />
            </Pressable>
          </View>

          {passwordMatchError && (
            <Text style={{ color: "red", marginTop: 5 }}>
              Passwords do not match
            </Text>
          )}
          <Pressable
            onPress={handleSignUp}
            style={{
              width: 350,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Sign Up
            </Text>
          </Pressable>
          <Pressable style={{ marginTop: 25 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account?{" "}
              <Text
                style={{
                  textAlign: "center",
                  color: "#4A55A2",
                  fontSize: 16,
                  fontWeight: "600",
                }}
                onPress={() => navigation.goBack()}
              >
                Sign In
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
