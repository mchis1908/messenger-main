import { StyleSheet} from "react-native";
import React from "react";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AIChat from "../screens/AIChat";
import ChatsScreen from "../screens/ChatsScreen";
import FriendsScreen from "../screens/FriendsScreen";
import Profile from "../screens/Profile";
const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false}}
      tabBarOptions={{
        style: { 
          padding: 20,
          backgroundColor: "black",
        },
        // showLabel: false,
    }}
    >
        <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={30}
                color={focused ? "#fff" : "black"}
                style={{
                  padding: 5,
                  backgroundColor: focused ? '#04724F' : 'transparent',
                  borderRadius: 10,
                  opacity: focused ? 0.8 : 1,
                }}
              />
            ),
          }}
      />
        <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="users"
                size={30}
                color={focused ? "#fff" : "black"}
                style={{
                  padding: 5,
                  backgroundColor: focused ? '#04724F' : 'transparent',
                  borderRadius: 10,
                  opacity: focused ? 0.8 : 1,
                }}
              />
            ),
          }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="home"
                size={30}
                color={focused ? "#fff" : "black"}
                style={{
                  padding: 5,
                  backgroundColor: focused ? '#04724F' : 'transparent',
                  borderRadius: 10,
                  opacity: focused ? 0.8 : 1,
                }}
              />
            ),
          }}
      />
      <Tab.Screen
        name="ChatAI"
        component={AIChat}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialCommunityIcons
                name="robot-excited-outline"
                size={30}
                color={focused ? "#fff" : "black"}
                style={{
                  padding: 5,
                  backgroundColor: focused ? '#04724F' : 'transparent',
                  borderRadius: 10,
                  opacity: focused ? 0.8 : 1,
                }}
              />
            );
          },
        }}
      />
       <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="user"
                size={30}
                color={focused ? "#fff" : "black"}
                style={{
                  padding: 5,
                  backgroundColor: focused ? '#04724F' : 'transparent',
                  borderRadius: 10,
                  opacity: focused ? 0.8 : 1,
                }}
              />
            ),
          }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
