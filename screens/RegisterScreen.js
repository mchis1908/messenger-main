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

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    // send a POST  request to the backend API to register the user
    axios
      .post("http://192.168.2.10:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
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
              placeholder="Passowrd"
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
            onPress={handleRegister}
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
