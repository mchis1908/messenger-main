import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { EXPO_PUBLIC_URL } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import User from "../components/User";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [originalUserList, setOriginalUserList] = useState([]); 
  const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false);
  const [friendData, setFriendData] = useState(null);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const newUserId = await AsyncStorage.getItem("userId");
      if (newUserId !== userId) {
        setUserId(newUserId);
        console.log(userId)
      }
    };
    fetchUserId();
  }, [userId]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/all/${userId}`);
        if (response.status === 200) {
          setUsers(response.data);
          console.log("users", users)
          setOriginalUserList(response.data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, [userId]);

  function handleSearchFriends(value) {
    if (value.length > 0) {
      const filteredFriends = users.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase())
      });
      setUsers(filteredFriends);
    } else {
      setUsers(originalUserList);
    }
  }

  const handleBarCodeScanned = ({ data }) => {
    setFriendData(JSON.parse(data));
    setOpenQrCodeScanner(false);
    console.log("friendData", friendData)
  }

  function activateScanner() {
    setOpenQrCodeScanner(true)
  }

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          `${EXPO_PUBLIC_URL}/user/friend-request/${userId}`
        );
        if (response.status === 200) {
          const friendRequestsData = response.data.map((friendRequest) => ({
            id: friendRequest.id,
            name: friendRequest.name,
            email: friendRequest.email,
            image: friendRequest.image,
          }));
  
          console.log("friendRequests", friendRequestsData)
          setFriendRequests(friendRequestsData);
        }
      } catch (err) {
        console.log("error message friend", err);
      }
    };
    if (userId) {
      fetchFriendRequests();
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Friends</Text>
        <Pressable onPress={activateScanner} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 30 }}>
          <TextInput onChangeText={handleSearchFriends} style={{ width: "90%", height: 40, borderWidth: 1, borderColor: "gray", borderRadius: 8, padding: 10 }} placeholder="Search friends..."/>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 25}}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>

      {
        openQrCodeScanner && (
          <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}/>
        )
      }
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Friend Requests</Text>
      </View>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
        {
          friendRequests.length > 0 ? (
            friendRequests.map((friendRequest) => (
              <FriendRequest
                key={friendRequest.id}
                friendRequest={friendRequest}
              />
            ))
          ) : (
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              No Friend Requests!
            </Text>
          )
        }
      </View>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
