import { StyleSheet, Text, View ,ScrollView, Pressable} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";
import { EXPO_PUBLIC_URL } from '@env'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  // useEffect(() => {
  //   const acceptedFriendsList = async () => {
  //     try {
  //       const response = await fetch(
  //         `${EXPO_PUBLIC_URL}/user/accepted-friends/${userId}`
  //       );
  //       const data = await response.json();

  //       if (response.status === 200) {
  //         setAcceptedFriends(data);
  //       }
  //     } catch (error) {
  //       console.log("error showing the accepted friends", error);
  //     }
  //   };

  //   acceptedFriendsList();
  // }, []);

  useEffect(() => {
    const getAllConversation = async () => {
      const userId = await AsyncStorage.getItem("userId");
      await setUserId(userId); 
      const response = await axios.get(`${EXPO_PUBLIC_URL}/conversation/${userId}`);
      console.log("response.data:", `${EXPO_PUBLIC_URL}/conversation/${userId}`)
      setAcceptedFriends(response.data.conversations);
    }
    getAllConversation()
  }, [])
  console.log("friends",acceptedFriends)
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop:40}}>
      <Pressable>
          {acceptedFriends.map((item,index) => (
              <UserChat key={index} item={item}/>
          ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
