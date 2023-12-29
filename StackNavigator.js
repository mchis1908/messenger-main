import { StyleSheet, Text, View } from "react-native";
import React, {useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPass from "./screens/ForgotPass";
import AIAssistant from "./screens/AIAssistant";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";
import MainScreen from "./MainScreen";
import DetailPost from "./screens/DetailPost";
import ManageMedia from "./screens/ManageMedia";
import ZoomedImageScreen from "./screens/ZoomedImageScreen";
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Messages" component={ChatMessagesScreen}/>
        <Stack.Screen name="AIAssistant" component={AIAssistant} />
        <Stack.Screen name="ForgotPass" component={ForgotPass}/>
        <Stack.Screen name="DetailPost" component={DetailPost} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageMedia" component={ManageMedia}/>
        <Stack.Screen name="ZoomedImage" component={ZoomedImageScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
