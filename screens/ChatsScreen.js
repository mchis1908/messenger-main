import { StyleSheet, Text, View ,ScrollView, Pressable, TextInput} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";
import { EXPO_PUBLIC_URL } from '@env'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [originalAcceptedFriends, setOriginalAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const getAllConversation = async () => {
      const response = await axios.get(`${EXPO_PUBLIC_URL}/conversation/${userId}`);
      setAcceptedFriends(response.data.conversations);
      setOriginalAcceptedFriends(response.data.conversations);
    }
    getAllConversation()
  }, [userId])

  function handleSearch(value) {
    if (value.length > 0) {
      const filteredFriends = acceptedFriends.filter((item) => {
        return (item.participant_1.id !== userId && item.participant_1.name.toLowerCase().includes(value.toLowerCase())) || (item.participant_2.id !== userId && item.participant_2.name.toLowerCase().includes(value.toLowerCase()))
      });
      setAcceptedFriends(filteredFriends);
    } else {
      setAcceptedFriends(originalAcceptedFriends);
    }
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Chats</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable>
              {acceptedFriends.map((item,index) => (
                  <UserChat key={index} item={item}/>
              ))}
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
