import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { HoldItem } from "react-native-hold-menu";
import { UserType } from "../UserContext";
import { Octicons } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons'; 
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from 'react-native-gesture-handler/Swipeable';

const MessageItem = ({ item, onReply, onDelete, onPin }) => {
    const { userId, setUserId } = useContext(UserType);
    const MenuItems = [
        { text: 'Reply', key: item.timestamp, icon: () => <Octicons name="reply" size={16} color="#fff" />, onPress: () => handleReplyMessage(item) },
        { text: 'Copy', key: item.timestamp, icon: () => <Feather name="copy" size={16} color="#fff" />, onPress: () => handleCopyMessage(item) },
        { text: 'Pin', key: item.timestamp, icon: () => <AntDesign name="pushpino" size={16} color="#fff" />, onPress: () => handlePinMessage(item) },
        { text: 'Delete', key: item.timestamp, icon: () => <MaterialIcons name="delete-outline" size={20} color="red" />, isDestructive: true, onPress: () => handleDeleteMessage(item) },
    ];
    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    async function handleCopyMessage(item) {
        await Clipboard.setStringAsync(item.message);
    }

    function handleReplyMessage(itemSelected) {
        onReply(itemSelected);
        console.log("owner", itemSelected.hasOwnProperty('replyFor'))
    }
    
    function handleDeleteMessage(item) {
        onDelete(item)
    }

    function handlePinMessage(itemSelected) {
      onPin(itemSelected);
    }

    if (item.messageType === "text") {
        return (
          <HoldItem items={MenuItems} key={item.timestamp}>
            {
              item.hasOwnProperty('replyFor') ? (item?.replyType === "text" ? (
                <View style={item?.senderId !== userId ? styles.replyMessage : styles.replyMessageOwner}>
                  <Text style={{color: '#474141'}}>
                    {item?.replyFor}
                  </Text>
                </View>
              ) : (
                <Image source={{ uri: item?.replyFor }} style={item?.senderId !== userId ? styles.replyImage : styles.replyImageOwner}/>
              )) : (null)
            }
            <Pressable
              style={[
                item?.senderId === userId
                  ? {
                      alignSelf: "flex-end",
                      backgroundColor: "#DCF8C6",
                      padding: 8,
                      maxWidth: "60%",
                      borderRadius: 7,
                      margin: 10,
                    }
                  : {
                      alignSelf: "flex-start",
                      backgroundColor: "white",
                      padding: 8,
                      margin: 10,
                      borderRadius: 7,
                      maxWidth: "60%",
                    },
              ]}
            >
              <Text
                style={{
                  fontSize: 13,
                  textAlign: 'left',
                }}
              >
                {item?.message}
              </Text>
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 9,
                  color: "gray",
                  marginTop: 5,
                }}
              >
                {formatTime(item.timestamp)}
              </Text>
            </Pressable>
          </HoldItem>
        );
      }

      if (item.messageType === "image") {
        const source = {uri: item.message};
        return (
          <HoldItem items={MenuItems} key={item.timestamp} styles={{ backgroundColor: "#fff !important" }}>
            <Pressable
              style={[
                item?.senderId === userId
                  ? {
                      alignSelf: "flex-end",
                      backgroundColor: "#DCF8C6",
                      padding: 8,
                      maxWidth: "60%",
                      borderRadius: 7,
                      margin: 10,
                    }
                  : {
                      alignSelf: "flex-start",
                      backgroundColor: "white",
                      padding: 8,
                      margin: 10,
                      borderRadius: 7,
                      maxWidth: "60%",
                    },
              ]}
            >
              <View>
                <Image
                  source={source}
                  style={{ width: 200, height: 200, borderRadius: 7 }}
                />
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "black",
                    marginTop: 15,
                  }}
                >
                  {formatTime(item?.timestamp)}
                </Text>
              </View>
            </Pressable>
          </HoldItem>
        );
      }
};
    
    const styles = StyleSheet.create({
        replyMessage: {
            backgroundColor: "#E5E5E5",
            padding: 10,
            borderRadius: 10,
            marginBottom: -20,
            maxWidth: "60%",
            alignSelf: "flex-start",
            paddingBottom: 20,
            margin: 10
          },
          replyMessageOwner: {
            backgroundColor: "#E5E5E5",
            padding: 10,
            borderRadius: 10,
            marginBottom: -20,
            maxWidth: "60%",
            alignSelf: "flex-end",
            paddingBottom: 20,
            margin: 10
          },
          replyImage: {
            backgroundColor: "#E5E5E5",
            padding: 10,
            borderRadius: 10,
            marginBottom: -20,
            maxWidth: "60%",
            alignSelf: "flex-start",
            paddingBottom: 20,
            margin: 10,
            height: 100, 
            width: 80,
            opacity: 0.7
          },
          replyImageOwner: {
            backgroundColor: "#E5E5E5",
            padding: 10,
            borderRadius: 10,
            marginBottom: -20,
            maxWidth: "60%",
            alignSelf: "flex-end",
            paddingBottom: 20,
            margin: 10,
            height: 100, 
            width: 80,
            opacity: 0.7
          }
    });

export default MessageItem;
