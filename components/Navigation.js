import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const Navigation = () => {
const navigation = useNavigation();
const route = useRoute();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' ,width: '100%', backgroundColor: '#fff', padding:12}}>
        {
            route.name === 'Chats' ? (
            <Ionicons name="chatbox-ellipses-outline" size={28} color="#fff" style={{ padding: 4, backgroundColor: '#04724F', borderRadius:10, opacity: 0.8}} />
            ) : (
                <Ionicons name="chatbox-ellipses-outline" size={28} color="black" style={{ padding: 4}} onPress={() => navigation.navigate("Chats")}/>
            )
        }
        {
            route.name === 'Friends' ? (
            <Feather name="users" size={25} color="#fff" style={{ padding: 4, backgroundColor: '#04724F', borderRadius:10, opacity: 0.8}} />
            ) : (
                <Feather name="users" size={25} color="black" style={{ padding: 4}} onPress={() => navigation.navigate("Friends")}/>
            )
        }
        {
            route.name === 'Home' ? (
            <Feather name="home" size={28} color="#fff" style={{ padding: 4, backgroundColor: '#04724F', borderRadius:10, opacity: 0.8}} />
            ) : (
                <Feather name="home" size={28} color="black" style={{ padding: 4}} onPress={() => navigation.navigate("Home")}/>
            )
        }
        {
            route.name === 'AIAssistant' ? (
                <MaterialCommunityIcons name="robot-excited-outline" size={31} color="#fff" style={{ padding: 4, backgroundColor: '#04724F', borderRadius:10, opacity: 0.8}}/>
            ) : (
                <MaterialCommunityIcons name="robot-excited-outline" size={31} color="black" style={{ padding:4}} onPress={() => navigation.navigate("AIAssistant")}/>
            )
        }
        <Feather name="log-out" size={24} color="black" style={{ padding:4}} onPress={() => navigation.navigate("Login")}/>
    </View>
  )
}

export default Navigation

const styles = StyleSheet.create({})