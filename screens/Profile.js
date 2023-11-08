import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Pressable, Alert, Image } from 'react-native'; // Import thêm Image
import { useNavigation } from '@react-navigation/core';
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_URL } from '@env';
import axios from "axios";
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP } from '../FirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const Profile = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState({});
  const { userId, setUserId } = useContext(UserType);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);

        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${storedUserId}`);
        setUsers(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
  }, []);


  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const storage = getStorage(FIREBASE_APP);
      const db = getFirestore(FIREBASE_APP);

      const fileName = `profile_${userId}.jpg`;
      const storageRef = ref(storage, `profile_images/${fileName}`);
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();


        // Upload the image to Firebase Storage
        const uploadTask = uploadBytes(storageRef, blob);

        await uploadTask;

        // Get the download URL for the uploaded image
        const url = await getDownloadURL(storageRef);

        // Update the user's profile image URL in Firestore
        const userDocRef = doc(db, "users", userId);
        const updateData = {
          image: url,
        };

        await updateDoc(userDocRef, updateData);

        // Update the state with the new image URL to trigger a re-render
        setImage(url);
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    }
  };
  



  return (
    <View style={{
      flex: 1,
      backgroundColor: "white",
      padding: 18,
      alignItems: 'center',
    }}>

      <Avatar
        rounded
        source={{ uri: image || users.image }}  // Use the 'image' state as the source
        size="large"
      />
      <Pressable onPress={handleImageUpload}>
        <Text>Upload Image</Text>
      </Pressable>
      <Text>{users.name}</Text>
      {/* Các tab chuyển sang các stack khác */}
      <Pressable
        onPress={() => navigation.navigate("Setting")}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>Setting</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("ChangePassword")}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>Change Password</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("ChangeInformation")}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>Change Information</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setUserId(null);
          navigation.navigate("Login");
        }}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>Log Out</Text>
      </Pressable>
    </View>
  )
}

const buttonStyle = {
  width: 350,
  backgroundColor: "#4A55A2",
  padding: 15,
  marginTop: 20,
  borderRadius: 10,
};

const buttonTextStyle = {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
};

export default Profile;
