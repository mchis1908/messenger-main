import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useLayoutEffect, useEffect, useState, useContext } from "react";
import User from "../components/User";
import Navigation from "../components/Navigation";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useState('1');

  useEffect(() => {
      const fetchUsers = async () => {
      await AsyncStorage.getItem("userId")
      .then((userId) => {
          console.log(userId);
      })
      .catch((error) => {
        console.log("Error retrieving userId:", error);
      });

      await axios
        .get(`http://192.168.1.12:8383/user/all/${userId}`)
        .then((response) => {
          setUsers(response.data);
          console.log('response', response)
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);
  console.log("users", users);
  return (
    <View style={{flex:1}}>
      <View style={{ padding: 25 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
      <View style={{position:'absolute', bottom:0, width:'100%'}}>
        <Navigation/>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
