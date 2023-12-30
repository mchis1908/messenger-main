// import { StyleSheet, Text, View } from "react-native";
// import React, {useEffect, useState, useContext } from "react";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from "./screens/HomeScreen";
// import FriendsScreen from "./screens/FriendsScreen";
// import ChatsScreen from "./screens/ChatsScreen";
// import AIChat from "./screens/AIChat";
// import Profile from "./screens/Profile";
// import { MaterialCommunityIcons, Ionicons, Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons'; 

// const MainScreen = () => {
//   const Tab = createBottomTabNavigator();
// return (
//     <Tab.Navigator screenOptions={({ route }) => ({
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//         headerShown: false,
//         tabBarStyle:{paddingTop: 5, borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white',position:'absolute',height:60, alignSelf: "center", height: 100},
//         tabBarLabelStyle:{fontSize:14, paddingBottom:3},
//     })}>
//       <Tab.Screen name="Home" component={HomeScreen} options={{
//         tabBarIcon: ({ focused, color, size }) => {
//           return (
//               <Feather name="home" size={25} color={color}/>
//           )},
//       }}/>
//       <Tab.Screen name="Friends" component={FriendsScreen} options={{
//         tabBarIcon: ({ focused, color, size }) => {
//           return (
//               <AntDesign name="adduser" size={26} color={color}/>
//           )},
//       }}/>
//       <Tab.Screen name="Chats" component={ChatsScreen} options={{
//         tabBarIcon: ({ focused, color, size }) => {
//           return (
//               <Ionicons name="chatbox-ellipses-outline" size={26} color={color}/>
//           )},
//       }}/>
//       <Tab.Screen name="AIChat" component={AIChat} options={{
//         tabBarIcon: ({ focused, color, size }) => {
//           return (
//               <MaterialCommunityIcons name="robot-excited-outline" size={30} color={color}/>
//           )},
//       }}/>
//       <Tab.Screen name="Profile" component={Profile} options={{
//         tabBarIcon: ({ focused, color, size }) => {
//           return (
//               <FontAwesome5 name="user" size={22} color={color} />
//           )},
//       }}/>
//     </Tab.Navigator>
//   );
// };

// export default MainScreen;

// const styles = StyleSheet.create({});

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './components/Icon';
import Colors from './constants/Colors';
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import AIChat from "./screens/AIChat";
import Profile from "./screens/Profile";
import * as Animatable from 'react-native-animatable';

const TabArr = [
    { route: 'Home', label: 'Home', type: Icons.Feather, icon: 'home', component: HomeScreen },
    { route: 'FriendsScreen', label: 'Friends', type: Icons.AntDesign, icon: 'adduser', component: FriendsScreen },
    { route: 'ChatsScreen', label: 'Chats', type: Icons.Ionicons, icon: 'chatbox-ellipses-outline', component: ChatsScreen },
    { route: 'AIChat', label: 'AIChat', type: Icons.MaterialCommunityIcons, icon: 'robot-excited-outline', component: AIChat },
    { route: 'Profile', label: 'Profile', type: Icons.FontAwesome5, icon: 'user', component: Profile },
  ];
  
  const Tab = createBottomTabNavigator();
  
  const animate1 = { 0: { scale: 1, translateY: 24 }, 1: { scale: 1.1, translateY: -5 } }
  const animate2 = { 0: { scale: 1.1, translateY: -5 }, 1: { scale: 1, translateY: 24 } }
  
  const circle1 = { 0: { scale: 0 }, 1: { scale: 1 } }
  const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }
  
  const TabButton = (props) => {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);
    const circleRef = useRef(null);
    const textRef = useRef(null);
  
    useEffect(() => {
      if (focused) {
        viewRef.current.animate(animate1);
        circleRef.current.animate(circle1);
        textRef.current.transitionTo({ scale: 1 });
      } else {
        viewRef.current.animate(animate2);
        circleRef.current.animate(circle2);
        textRef.current.transitionTo({ scale: 0 });
      }
    }, [focused])
  
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={styles.container}>
        <Animatable.View
            ref={viewRef}
            duration={300}
            style={styles.container}
        >
            <View style={styles.btn}>
                <Animatable.View
                ref={circleRef}
                style={styles.circle} />
                <Icon type={item.type} name={item.icon} color={focused ? Colors.white : Colors.primary} />
            </View>
            <Animatable.Text
                ref={textRef}
                style={styles.text}
            >
                {item.label}
            </Animatable.Text>
        </Animatable.View>
      </TouchableOpacity>
    )
  }
  
  export default function AnimTab1() {
    return (
      <Tab.Navigator
        initialRouteName="ChatsScreen"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.route} component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />
              }}
            />
          )
        })}
      </Tab.Navigator>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBar: {
      height: 58,
      position: 'absolute',
      bottom: 20,
      right: 16,
      left: 16,
      borderRadius: 16,
    },
    btn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 4,
      borderColor: Colors.white,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center'
    },
    circle: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      borderRadius: 25,
    },
    text: {
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.primary,
    }
})