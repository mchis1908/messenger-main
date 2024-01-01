import { StyleSheet, Text, View, Pressable, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const [participant, setParticipant] = useState(null);
  const navigation = useNavigation();
  const [lastMessage, setLastMessage] = useState({});
  const defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/talk-time-23c0d.appspot.com/o/assets%2Fdefault-group-avatar.png?alt=media&token=2ffdbd3f-d88d-4763-aa88-0cd9608b25c2"
  const defaultGroupName = "Group Chat"

  useEffect( () => {
    const getParticipant = async () => {
      if(item.type === "individual" && item.participant_1.id === userId) {
        setParticipant(item.participant_2)
      } else {
        setParticipant(item.participant_1)
      }
      setLastMessage(item.lastMessage)
    }
    getParticipant()
  }, [userId]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleNavigateGroupChat = () => {
    navigation.navigate("Messages", {
        conversationId: item.id,
        groupInfor: item,
        type: "group",
    })
  }

  return (
    item.type === "individual" ? (
        <Pressable
            onPress={() =>
                navigation.navigate("Messages", {
                recepientId: participant.id,
                conversationId: item.id,
                type: "individual",
                })
            }
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 0.7,
                borderColor: "#D0D0D0",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10,
            }}
            >
            <Image
                style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
                source={{ uri: participant?.image }}
            />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{participant?.name}</Text>
                {lastMessage.message ? (
                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
                    {userId === lastMessage.senderId ? "You: " : ""}{lastMessage.messageType === "text" ? lastMessage.message : "Image"}
                </Text>
                ) : (
                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
                    No messages yet
                </Text>
                )}
            </View>

            <View>
                <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
                {lastMessage.timestamp && formatTime(lastMessage?.timestamp)}
                </Text>
            </View>
            </Pressable>
    ) : (
        <TouchableOpacity onPress={handleNavigateGroupChat}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, padding: 10 }}>
                <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }} source={{ uri: item.groupAvatar ? item.groupAvatar : defaultAvatarUrl }}/>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>{ item.groupName ? item.groupName : defaultGroupName }</Text>
                    <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
                        {
                            item.lastMessage.message ? (
                                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
                                    {userId === item.lastMessage.senderId ? "You: " : ""}{item.lastMessage.messageType === "text" ? item.lastMessage.message : "Image"}
                                </Text>
                            ) : (
                                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
                                    { item.participants.length } members
                                </Text>
                            )
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
  );
};

export default UserChat;

const styles = StyleSheet.create({});
