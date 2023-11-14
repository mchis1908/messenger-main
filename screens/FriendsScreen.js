import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { EXPO_PUBLIC_URL } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);

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
