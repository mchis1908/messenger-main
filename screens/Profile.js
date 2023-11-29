import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, Pressable, Alert, Image, TextInput, TouchableOpacity } from 'react-native'; // Import thêm Image
import { useNavigation } from '@react-navigation/core';
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_URL } from '@env';
import axios from "axios";
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'; 
import QRCodeModal from '../components/qrCodeModal';
import { Modalize } from 'react-native-modalize';
import { updatePassword } from 'firebase/auth';

const Profile = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState({});
  const { userId, setUserId } = useContext(UserType);
  const [image, setImage] = useState(null);
  const [isShowQrModal, setIsShowQrModal] = useState(false);
  const modalInformation = useRef();
  const modalPassword = useRef()
  const [editInformation, setEditInformation] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("storedUserId", storedUserId)
        setUserId(storedUserId);

        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${userId}`);
        console.log("response", response)
        setUsers(response.data);
        console.log("userData", users)
        setEditInformation(response.data.name);
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
        const uploadTask = uploadBytes(storageRef, blob);

        await uploadTask;

        const url = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", userId);
        const updateData = {
          image: url,
        };

        await updateDoc(userDocRef, updateData);

        setImage(url);
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    }
  };
  
  const handleOpenQrModal = () => {
	setIsShowQrModal(true);
  }

  const handleCloseQrModal = () => {
	setIsShowQrModal(false);
  }

  const onPressPersonalInformation = () => {
    modalInformation.current?.open();
  }

  const onPressChangePassword = () => {
    modalPassword.current?.open();
  }

  const handleUpdateInformation = async () => {
    const storedUserId = await AsyncStorage.getItem("userId");
    const userRef = doc(FIREBASE_FIRESTORE, "users", storedUserId);
    await updateDoc(userRef, {
        name: editInformation
    }).then(() => {
        setUsers({
            ...users,
            name: editInformation
        })
        modalInformation.current?.close();
    })
  }

  const handleUpdatePassword = async () => {
    const user = FIREBASE_AUTH.currentUser;
    updatePassword(user, editPassword).then(() => {
        alert("Password updated successfully")
        modalPassword.current?.close();
    }).catch((error) => {
        console.log("error", error)
        alert(error.message)
    })
  }

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
		<View style={[{ marginTop: 40, width: "100%", alignItems: "center" }, boxShadow]}>
			<Pressable onPress={handleOpenQrModal} style={[profileCard, {borderTopLeftRadius: 10, borderTopRightRadius: 10, marginBottom: 5}]}>
				<Ionicons name="qr-code-outline" size={24} color="black" />
				<Text style={profileCardText}>My QR Code</Text>
			</Pressable>

			<View style={hrTag}></View>

			<Pressable onPress={onPressPersonalInformation} style={profileCard}>
				<Octicons name="person" size={24} color="black" />
				<Text style={profileCardText}>Personal Information</Text>
			</Pressable>

			<View style={hrTag}></View>

			<Pressable onPress={onPressChangePassword} style={[profileCard, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: 5 }]}>
				<Feather name="lock" size={24} color="black" />
				<Text style={profileCardText}>Change Password</Text>
			</Pressable>
		</View>

		<Pressable onPress={() => { setUserId(null); navigation.navigate("Login"); }} style={buttonStyle}>
			<Text style={buttonTextStyle}>Log Out</Text>
			<Ionicons name="ios-log-out-outline" size={24} color="#fff" />
		</Pressable>

		<QRCodeModal isVisible={isShowQrModal} userData={{ id: userId }} onClose={handleCloseQrModal}/>

        <Modalize ref={modalInformation} modalTopOffset={500}>
            <View style={inputGroup}>
                <Text style={labelInformation}>Display name</Text>
                <TextInput onChangeText={(value) => setEditInformation(value)} style={inputInformation} defaultValue={users.name} value={editInformation}/>
            </View>

            <TouchableOpacity onPress={handleUpdateInformation} style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "bold", marginTop: 20, width: "70%", textAlign: "center", backgroundColor: "#A6CF98", paddingVertical: 10 }}>Save</Text>
            </TouchableOpacity>
        </Modalize>

        <Modalize ref={modalPassword} modalTopOffset={500}>
            <View style={inputGroup}>
                <Text style={labelInformation}>New Password</Text>
                <TextInput secureTextEntry={true} onChangeText={(value) => setEditPassword(value)} style={inputInformation} value={editPassword} placeholder='Enter new password'/>
            </View>

            <TouchableOpacity onPress={handleUpdatePassword} style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "bold", marginTop: 20, width: "70%", textAlign: "center", backgroundColor: "#A6CF98", paddingVertical: 10 }}>Save</Text>
            </TouchableOpacity>
        </Modalize>
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
  gap: 15,
  width: "100%"
}

const profileCardText = {
  fontSize: 16,
  fontWeight: 500,
  color: "black",
}

const boxShadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,

  elevation: 6,
}

const hrTag = {
  width: "85%",
  height: 1,
  backgroundColor: "gray"
}

const inputGroup = {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    flexDirection: "row"
}

const inputInformation = {
    width: "70%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10
}

const labelInformation = {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
}

export default Profile;
