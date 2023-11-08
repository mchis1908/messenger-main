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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { EXPO_PUBLIC_URL } from '@env'

const RegisterScreen = () => {
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        await axios.post(EXPO_PUBLIC_URL+ "/user", {
          name: name,
          email: email,
          password: password,
          image: image,
          friendRequests: [],
          friends: [],
          sentFriendRequests: [],
          id: user.uid,
          conversations: []
        }).then((response) => {
          alert("Registration successful");
          console.log(response);
        })
      })
      
    } catch (error) {
      alert("Registration failed: " + error.message);
      console.log("error", error);
    }
  }

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
            <Icon style={styles.icon} name="account" size={18} color="gray" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: name ? 18 : 18,
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
            <Icon style={styles.icon} name="email" size={18} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 18,
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
            <Icon style={styles.icon} name="lock" size={18} color="gray" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                fontSize: password ? 18 : 18,
                flex: 1,
                padding: 10,
              }}
              placeholder="Password"
            />
          </View>
          <View
            className="signUp-image-input"
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
            <Icon style={styles.icon} name="image" size={18} color="gray" />
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: image ? 18 : 18,
                flex: 1,
                padding: 10,
              }}
              placeholder="Image"
            />
          </View>
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
            Already Have an account?{" "}
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
