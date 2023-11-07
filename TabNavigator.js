import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import AIChat from "./screens/AIChat";
import Profile from "./screens/Profile";
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons'; 

import { useRoute } from '@react-navigation/native';
const TabNavigator = () => {
    const Tab = createBottomTabNavigator();
    const route = useRoute();
return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
    })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
                <Feather name="home" size={28} color={color}/>
            )},
        }}/>
        <Tab.Screen name="Friends Request" component={FriendsScreen} options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
                <Feather name="users" size={25} color={color}/>
            )},
        }}/>
        <Tab.Screen name="Chats" component={ChatsScreen} options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
                <Ionicons name="chatbox-ellipses-outline" size={25} color={color}/>
            )},
        }}/>
        <Tab.Screen name="AIChat" component={AIChat} options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
                <MaterialCommunityIcons name="robot-excited-outline" size={31} color={color}/>
            )},
        }}/>
        <Tab.Screen name="Profile" component={Profile} options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
                <Ionicons name="chatbox-ellipses-outline" size={25} color={color}/>
            )},
        }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
