import { StyleSheet, Text, View ,ScrollView, Pressable} from "react-native";
import React, { useContext,useEffect,useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";
import { EXPO_PUBLIC_URL } from '@env'
import Navigation from "../components/Navigation";
import axios from "axios";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `${EXPO_PUBLIC_URL}/user/accepted-friends/${userId}`
        );
        const data = await response.json();

        if (response.status === 200) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("error showing the accepted friends", error);
      }
    };

    acceptedFriendsList();
  }, []);
  console.log("friends",acceptedFriends)
  return (
    <View style={{flex:1}}>
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop:40}}>
        <Pressable>
            {acceptedFriends.map((item,index) => (
                <UserChat key={index} item={item}/>
            ))}
        </Pressable>
      </ScrollView>
      <View style={{position:'absolute', bottom:0, width:'100%'}}>
        {/* <Navigation/> */}
      </View>
    </View>
    
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
