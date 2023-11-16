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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'; 

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
        console.log("userData", users)
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
  }, [userId]);


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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 18, alignItems: 'center'}}>
      <View style={{ borderWidth: 3, borderColor: "#557C55", padding: 5, borderRadius: 100, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6 }}>
        <Image source={{ uri: image || users.image }} style={{ width: 100, height: 100, borderRadius: 200 }}/>
        <Pressable onPress={handleImageUpload} style={{ position: "absolute", bottom: 0, right: -5, backgroundColor: "gray", borderRadius: 100, width: 35, height: 35, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="ios-camera" size={24} color="white" />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>{users.name}</Text>
        <Feather name="edit-3" size={20} color="gray" />
      </View>

      <Text style={{ fontSize: 16, color: "gray" }}>{users.email}</Text>
      <View style={{ marginTop: 40, width: "100%" }}>
        <Pressable style={[profileCard, {borderTopLeftRadius: 10, borderTopRightRadius: 10, marginBottom: 5}]}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
          <Text style={profileCardText}>Scan QR Code</Text>
        </Pressable>

        <Pressable style={[profileCard, { marginBottom: 5 }]}>
          <Ionicons name="qr-code-outline" size={24} color="black" />
          <Text style={profileCardText}>My QR Code</Text>
        </Pressable>

        <Pressable style={profileCard}>
          <Octicons name="person" size={24} color="black" />
          <Text style={profileCardText}>Change Personal Information</Text>
        </Pressable>

        <Pressable style={[profileCard, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: 5 }]}>
          <Feather name="lock" size={24} color="black" />
          <Text style={profileCardText}>Change Password</Text>
        </Pressable>
      </View>

      {/* <Pressable onPress={() => navigation.navigate("Setting")} style={buttonStyle}>
        <Text style={buttonTextStyle}>Setting</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangePassword")} style={buttonStyle}>
        <Text style={buttonTextStyle}>Change Password</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ChangeInformation")} style={buttonStyle} >
        <Text style={buttonTextStyle}>Change Information</Text>
      </Pressable> */}

      <Pressable onPress={() => { setUserId(null); navigation.navigate("Login"); }} style={buttonStyle}>
        <Text style={buttonTextStyle}>Log Out</Text>
        <Ionicons name="ios-log-out-outline" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  )
}

const buttonStyle = {
  backgroundColor: "#FF6D60",
  padding: 15,
  marginTop: 20,
  borderRadius: 50,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 15
};

const buttonTextStyle = {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
};

const profileCard = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 15,
  backgroundColor: "#D1E8E4",
  gap: 15,
}

const profileCardText = {
  fontSize: 16,
  fontWeight: 500,
  color: "black",
}

export default Profile;
