import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import React, {useEffect, useState, useContext } from "react";
import User from "../components/User";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EXPO_PUBLIC_URL } from '@env'
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { BarCodeScanner } from 'expo-barcode-scanner';

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  
 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>Home</Text>
        
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
