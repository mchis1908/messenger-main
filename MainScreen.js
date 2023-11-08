import { StyleSheet, Text, View } from "react-native";
import React, {useEffect, useState, useContext } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import AIChat from "./screens/AIChat";
import Profile from "./screens/Profile";
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons'; 

const MainScreen = () => {
  const Tab = createBottomTabNavigator();
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
              <AntDesign name="adduser" size={26} color={color}/>
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
      <Tab.Screen name="Profile" component={Profile} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
              <FontAwesome5 name="user" size={22} color={color} />
          )},
      }}/>
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
