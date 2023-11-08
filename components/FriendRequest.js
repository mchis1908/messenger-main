import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { EXPO_PUBLIC_URL } from '@env'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUsers = async () => {
      const userId = await AsyncStorage.getItem("userId");
      await setUserId(userId);
    };
    fetchUsers();
  }, []);

  const acceptRequest = async (friendRequestId) => {
    try {
      // const response = await fetch(
      //   `${EXPO_PUBLIC_URL}/user/friend-request/accept`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       senderId: friendRequestId,
      //       recepientId: userId,
      //     }),
      //   }
      // );
      const response = await axios.post(`${EXPO_PUBLIC_URL}/user/friend-request/accept`, {
        "senderId": friendRequestId,
        "recipientId": userId
      });

      if (response.status===200) {
        setFriendRequests(
          friendRequests.filter((request) => request.id !== friendRequestId)
        );

        await axios.post(`${EXPO_PUBLIC_URL}/conversation`, {
          "user1Id": userId,
          "user2Id": friendRequestId
        }).then((response) => {
          navigation.navigate("Chats");
        })
      }
    } catch (err) {
      console.log("error acceptin the friend request", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request!!
      </Text>

      <Pressable
        onPress={() => acceptRequest(item.id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
