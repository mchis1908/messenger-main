import { StyleSheet, Text, View, Pressable, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState, useRef } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { EXPO_PUBLIC_URL } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import User from "../components/User";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Modalize } from "react-native-modalize";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [originalUserList, setOriginalUserList] = useState([]); 
  const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const modalizeRef = useRef()

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("storedUserId", storedUserId)
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);
  
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
    if (userId) {
      fetchData();
    }
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

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log("aaaaaa", data)

    const response = await fetch(`${EXPO_PUBLIC_URL}/user/${data}`);
    if (response.ok) {
        const data = await response.json();
        setFriendData(data);
        modalizeRef.current?.open();
    }
    setOpenQrCodeScanner(false);
  }

  function activateScanner() {
    setOpenQrCodeScanner(true)
  }

  useEffect(() => {
    const fetchFriendRequests = async () => {
        const userId = await AsyncStorage.getItem("userId");
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
  }, [userId]);

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

      
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Friend Requests</Text>
      </View>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
        {
          friendRequests.length > 0 ? (
            friendRequests.map((item,index) => (
              <FriendRequest
                key={index}
                item={item}
                friendRequests={friendRequests}
                setFriendRequests={setFriendRequests}
              />
            ))
          ) : (
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              No Friend Requests!
            </Text>
          )
        }
      </View>

      {
        friendData && (
          <Modalize ref={modalizeRef} modalTopOffset={400}>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", width: "100%", paddingVertical: 20 }}>Add friend</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Image style={styles.friendAvatar} source={{ uri: friendData.image }}/>
                <View style={styles.friendBody}>
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{ friendData.name }</Text>
                  <Text style={{ fontSize: 15, fontWeight: "500", color: "gray" }}>{ friendData.email }</Text>
                </View>
              </View>
              <TouchableOpacity style={{backgroundColor: "#092635", borderRadius: 16, marginTop: 20}} onPress={() => handleAddFriend()}>
                <Text style={{ fontSize: 16, fontWeight: "bold", width: "100%", paddingVertical: 10, textAlign: "center", color: "white" }}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        )
      }
      {
        openQrCodeScanner && (
          <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}/>
        )
      }
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
    friendCard: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    }, friendAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#43766C",
    }, friendBody: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 5,
    }
});
