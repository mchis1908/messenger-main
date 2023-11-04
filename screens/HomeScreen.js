import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import User from "../components/User";
import Navigation from "../components/Navigation";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null); // Use useState directly

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId); // No need to use await here
  
        // Fetch and set users based on userId
        const response = await axios.get(`http://192.168.1.12:8383/user/all/${storedUserId}`);
        setUsers(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
  }, []);

  // This will be logged after users state has been set
  return (
    <View style={{flex:1}}>
      {/* <View style={{ padding: 25 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View> */}
      <View style={{position:'absolute', bottom:0, width:'100%'}}>
        <Navigation/>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
