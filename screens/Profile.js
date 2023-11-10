import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Pressable, Image, Modal, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_URL } from '@env';
import axios from "axios";
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, list } from 'firebase/storage';
import { FIREBASE_APP } from '../FirebaseConfig';
import { doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const Profile = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState({});
  const { userId, setUserId } = useContext(UserType);
  const [image, setImage] = useState(null);
  const [avatarList, setAvatarList] = useState([]);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  const toggleAvatarModal = () => {
    setIsAvatarModalVisible(!isAvatarModalVisible);
  };

  const updateAvatarList = async () => {
    const storage = getStorage(FIREBASE_APP);
    const storageRef = ref(storage, `profile_images/${userId}`);
    const listResult = await list(storageRef);
    const avatarUrls = await Promise.all(listResult.items.map((item) => getDownloadURL(item)))
    setAvatarList(avatarUrls);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);

        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${storedUserId}`);
        setUsers(response.data);

        // Lấy danh sách avatar từ Firebase Storage
        updateAvatarList();
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
  }, []);

  const uploadImageAndRefreshList = async () => {
    const timestamp = new Date()
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const storage = getStorage(FIREBASE_APP);
      const db = getFirestore(FIREBASE_APP);

      const fileName = `profile_${userId}_${timestamp.getTime()}.jpg`;
      const storageRef = ref(storage, `profile_images/${userId}/${fileName}`);
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const uploadTask = uploadBytes(storageRef, blob);
        await uploadTask;
        const url = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", userId);
        const updateData = {
          image: url,
        };
        await updateDoc(userDocRef, updateData);
        setImage(url);

        // Cập nhật danh sách avatar sau khi tải lên
        updateAvatarList();
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    }
    // Đóng modal sau khi tải hình lên
    setIsAvatarModalVisible(false);
  };

  const handleSelectNewAvatar = async (avatarUrl) => {
    setImage(avatarUrl);
    try {
      const db = getFirestore(FIREBASE_APP);
      const userDocRef = doc(db, "users", userId);
      const updateData = {
        image: avatarUrl,
      };
      await updateDoc(userDocRef, updateData);
    } catch (error) {
      console.error("Error updating user image:", error);
    }
    // Đóng modal sau khi chọn xong
    setIsAvatarModalVisible(false);
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
        source={{ uri: image || users.image }}
        size="xlarge"
        onPress={toggleAvatarModal} // Mở modal khi nhấn vào avatar
      />

      <Modal
        visible={isAvatarModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleAvatarModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text>Select a New Avatar</Text>
            <FlatList
              data={avatarList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectNewAvatar(item)}>
                  <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleAvatarModal}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Pressable onPress={uploadImageAndRefreshList}>
        <Text>Upload Image</Text>
      </Pressable>
      <Text>{users.name}</Text>
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
        onPress={() => navigation.navigate("Login")}
        style={buttonStyle}
      >
        <Text style={buttonTextStyle}>Log Out</Text>
      </Pressable>
    </View>
  );
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
