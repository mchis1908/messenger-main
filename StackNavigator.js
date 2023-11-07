import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";
import TabNavigator from "./TabNavigator";
import AIAssistant from "./screens/AIAssistant";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Messages" component={ChatMessagesScreen}/>
        <Stack.Screen name="AIAssistant" component={AIAssistant} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
