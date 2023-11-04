import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/logo.png";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      const uid = user.uid;
      AsyncStorage.setItem("userId", uid);
      navigation.navigate("Home");
    } catch (error) {
      alert("Login failed: " + error.message);
      console.log("error", error);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        padding: 10,
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
            Sign In
          </Text>
        </View>

        <View style={{ marginTop: 40, width: 350 }}>
          <View
            className="signIn-email-input"
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
            className="signIn-pass-input"
            style={{
              marginTop: 20,
              borderColor: "gray",
              borderWidth: 0.5,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
              paddingLeft: 10,
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
          <Pressable style={{ marginTop: 15 }}>
            <Text style={{ textAlign: "right", color: "gray", fontSize: 14 }}>
              Forgot password ?
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSignIn}
            style={{
              width: 350,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 100,
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
              Sign In
            </Text>
          </Pressable>
          <Pressable style={{ marginTop: 25 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't Have an account?{" "}
              <Text
                style={{
                  textAlign: "center",
                  color: "#4A55A2",
                  fontSize: 16,
                  fontWeight: "600",
                }}
                onPress={() => navigation.navigate("Register")}
              >
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
