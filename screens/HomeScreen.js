import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import User from "../components/User";
import Navigation from "../components/Navigation";

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
      <View style={{position:'absolute', bottom:0, width:'100%'}}>
        <Navigation/>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
