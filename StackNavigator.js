import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPass from "./screens/ForgotPass";
import AIAssistant from "./screens/AIAssistant";
import Navigation from "./components/Navigation";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPass"
          component={ForgotPass}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MainScreen" component={Navigation} options={{ headerShown: false }}/>
        <Stack.Screen name="AIAssistant" component={AIAssistant} />
        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
