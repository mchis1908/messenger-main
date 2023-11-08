import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import NotifiactionModal from "../components/NotificationModal";

const ForgotPass = () => {
  const auth = FIREBASE_AUTH;
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setAlertMessage("Password reset email sent. Please check your email.");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Password reset failed: " + error.message);
      setShowAlert(true);
      console.log("error", error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <NotifiactionModal
        message={alertMessage}
        isVisible={showAlert}
        onConfirm={() => setShowAlert(false)}
      />
        <View style={styles.innerContainer}>
          <Icon
            name="lock-reset"
            size={50}
            color="#4A55A2"
            style={styles.icon}
          />
          <Text style={styles.forgotPasswordText}>Recover Password</Text>
          <Text style={styles.forgotPasswordDetailText}>
            Enter the email address associated with your account and we'll send
            an email instructions on how to recover your password
          </Text>
          <Text style={styles.enterEmailLabel}>Enter Email:</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={18} color="gray" style={styles.lockIcon} />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 16 : 16,
                flex: 1,
                padding: 10,
              }}
              placeholder="Enter your email"
            />
          </View>
          <Pressable
            onPress={handleResetPassword}
            style={{
              width: "100%",
              backgroundColor: "#4A55A2",
              padding: 15,
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
              Send
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 18,
  },
  innerContainer: {
    flex: 1,
    marginTop: 100,
    // alignItems: "flex-start",
  },
  icon: {
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 10,
  },
  forgotPasswordDetailText: {
    fontSize: 14,
    marginBottom: 20,
    color: "gray",
  },
  enterEmailLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    marginLeft: 15,
  },
  input: {
    padding: 10,
    flex: 1,
  },
});

export default ForgotPass;
