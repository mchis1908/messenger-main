import { StyleSheet, View, Text, TextInput } from "react-native";
import React, {useEffect, useState, useContext } from "react";
import User from "../components/User";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EXPO_PUBLIC_URL } from '@env'
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [originalUserList, setOriginalUserList] = useState([]); 
  const { userId, setUserId } = useContext(UserType);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const newUserId = await AsyncStorage.getItem("userId");
      if (newUserId !== userId) {
        setUserId(newUserId);
        console.log(userId)
      }
    };
    fetchUserId();
  }, [userId]);
  
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
    fetchData();
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Home</Text>
        <TextInput onChangeText={handleSearchFriends} style={{ width: "90%", height: 40, borderWidth: 1, borderColor: "gray", borderRadius: 8, padding: 10 }} placeholder="Search friends..."/>
      </View>
      <View style={{ paddingHorizontal: 25}}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
