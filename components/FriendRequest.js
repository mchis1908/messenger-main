import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import { EXPO_PUBLIC_URL } from '@env'

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_URL}/user/friend-request/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "senderId": friendRequestId,
          "recipientId": userId
        }),
      })
      console.log("response", response)

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request.id !== friendRequestId)
        );

        await fetch(`${EXPO_PUBLIC_URL}/conversation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user1Id": userId,
                "user2Id": friendRequestId
            }),
        })
      }
    } catch (err) {
      console.log("error accept in the friend request", err);
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
        source={{ uri: item?.image }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request!!
      </Text>

      <Pressable
        onPress={() => acceptRequest(item?.id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
