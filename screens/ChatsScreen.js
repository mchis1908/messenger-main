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

  useEffect(() => {
    const getAllConversation = async () => {
      const response = await axios.get(`${EXPO_PUBLIC_URL}/conversation/${userId}`);
      setAcceptedFriends(response.data.conversations);
    }
    getAllConversation()
  }, [userId])
  
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
