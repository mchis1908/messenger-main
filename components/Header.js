import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Header = () => {
const navigation = useNavigation();
return (
    <View style={{flexDirection: "row", justifyContent:'space-between'}}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={28} color="black" />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={28}
            color="black"
          />
        </View> 
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})