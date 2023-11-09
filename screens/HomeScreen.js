import { StyleSheet, View } from "react-native";
import React, {useEffect, useState, useContext } from "react";
import User from "../components/User";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EXPO_PUBLIC_URL } from '@env'

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const newUserId = await AsyncStorage.getItem("userId");
      if (newUserId !== userId) {
        setUserId(newUserId);
      }
    };
    fetchUserId();
  }, [userId]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/all/${userId}`);
        setUsers(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <View style={{ padding: 25, paddingTop:40}}>
      {users.map((item, index) => (
        <User key={index} item={item} />
      ))}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
