import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import User from "../components/User";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  return (
    <View style={{flex:1}}>
      {/* <View style={{ padding: 25 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View> */}
      {/* <Pressable
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 15 }}
      >
        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
          Logout
        </Text>
      </Pressable> */}
      <View style={{position:'absolute', bottom:0, width:'100%'}}>
        <Navigation/>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
