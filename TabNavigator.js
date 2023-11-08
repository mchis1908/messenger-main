import { StyleSheet, Text, View } from "react-native";
import React, {useEffect, useState, useContext } from "react";
// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import AIChat from "./screens/AIChat";
import Profile from "./screens/Profile";
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons'; 
import { UserType } from "./UserContext";
import { EXPO_PUBLIC_URL } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { useRoute } from '@react-navigation/native';
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const route = useRoute();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUsers();
  }, []);
return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle:{paddingTop: 5, borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white',position:'absolute',height:60, alignSelf: "center"},
        tabBarLabelStyle:{fontSize:14, paddingBottom:3},
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <Feather name="home" size={25} color={color}/>
          )},
      }}/>
      <Tab.Screen name="Friends" component={FriendsScreen} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <Feather name="users" size={24} color={color}/>
          )},
      }}/>
      <Tab.Screen name="Chats" component={ChatsScreen} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <Ionicons name="chatbox-ellipses-outline" size={26} color={color}/>
          )},
      }}/>
      <Tab.Screen name="AIChat" component={AIChat} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <MaterialCommunityIcons name="robot-excited-outline" size={30} color={color}/>
          )},
      }}/>
      <Tab.Screen name="Setting" component={Profile} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <AntDesign name="setting" size={26} color={color} />
          )},
      }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
