import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserType } from "../UserContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";
import { EXPO_PUBLIC_URL } from '@env'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import { Modalize } from "react-native-modalize";
import FriendCard from "../components/friendCard";
import { CheckBox } from "react-native-elements";

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [originalAcceptedFriends, setOriginalAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const [user, setUser] = useState({});
    const navigation = useNavigation();
    const modalizeRef = useRef()
    const [selectedFriend, setSelectedFriend] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getAllConversation()
        }
    }, [isFocused])

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");
            setUserId(storedUserId);
            console.log("storedUserId", storedUserId)
        };
        fetchUserId();
    }, []);

        const fetchUser = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("userId");
            console.log("storedUserId", storedUserId)
            setUserId(storedUserId);
    
            const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${storedUserId}`);
            console.log("response", response)
            setUser(response.data);
            console.log("userData friends", user.friends)
          } catch (error) {
            console.log("Error:", error);
          }
        };

        const getAllConversation = async () => {
            const response = await axios.get(`${EXPO_PUBLIC_URL}/conversation/${userId}`);
            console.log("response", response)
            setAcceptedFriends(response.data.conversations);
            setOriginalAcceptedFriends(response.data.conversations);
            console.log("conversations", acceptedFriends)
        }
    useEffect(() => {
        if (userId) {
            getAllConversation()
        }
    }, [userId])

    function handleSearch(value) {
        if (value.length > 0) {
            const filteredFriends = acceptedFriends.filter((item) => {
                return (item.participant_1.id !== userId && item.participant_1.name.toLowerCase().includes(value.toLowerCase())) || (item.participant_2.id !== userId && item.participant_2.name.toLowerCase().includes(value.toLowerCase()))
            });
            setAcceptedFriends(filteredFriends);
        } else {
            setAcceptedFriends(originalAcceptedFriends);
        }
    }

    async function handleOpenModalCreateChat() {
        await fetchUser();
        await modalizeRef.current?.open()
    }

    function handleSelectFriend(id) {
        const updatedSelectedFriend = [...selectedFriend];
        if (updatedSelectedFriend.includes(id)) {
            const index = updatedSelectedFriend.indexOf(id);
            updatedSelectedFriend.splice(index, 1);
          } else {
            updatedSelectedFriend.push(id);
          }
      
          setSelectedFriend(updatedSelectedFriend);
    }

    async function handleCreateGroupChat() {
        if (selectedFriend.length > 1) {
            const response = await axios.post(`${EXPO_PUBLIC_URL}/conversation/group`, {
                userIds: [...selectedFriend, userId]
            })
            await getAllConversation()
            setSelectedFriend([])
            await modalizeRef.current?.close()
        } else {
            alert("Please select at least two friend to create group chat!")
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingRight: 20 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 20, alignSelf: "flex-start" }}>Chats</Text>
                    <TouchableOpacity onPress={handleOpenModalCreateChat}>
                        <AntDesign name="addusergroup" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Pressable>
                        {
                            acceptedFriends.length > 0 ? (
                                acceptedFriends.map((item, index) => (
                                    <UserChat key={index} item={item} />
                                ))
                            ) : (
                                <Text style={{ fontSize: 20, textAlign: "center" }}>
                                    No Chat Message!
                                </Text>
                            )
                        }
                    </Pressable>
                </ScrollView>
            </View>

            <Modalize ref={modalizeRef}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", width: "100%", paddingVertical: 20 }}>Create group chat</Text>
                    <TextInput placeholder="Search friend's name..." style={{ borderWidth: 1, padding: 10, borderRadius: 12, borderColor: "darkgray" }}/>

                    <ScrollView style={{ marginTop: 30, height: 450 }}>
                        {
                            Object.keys(user).length > 0 ? user?.friends.map((item, index) => (
                                <View style={{ flexDirection: "row" }} key={index}>
                                    <FriendCard friendId={item}/>
                                    <CheckBox onPress={() => handleSelectFriend(item)} checked={selectedFriend.includes(item)}/>
                                </View>
                            )) : (
                                <Text style={{ fontSize: 20, textAlign: "center" }}>
                                    You don't have any friends yet!
                                </Text>
                            )
                        }
                    </ScrollView>

                    <TouchableOpacity disabled={selectedFriend.length === 0} style={{backgroundColor: "#092635", borderRadius: 16}} onPress={() => handleCreateGroupChat()}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", width: "100%", paddingVertical: 10, textAlign: "center", color: "white" }}>Create</Text>
                    </TouchableOpacity>
                </View>
            </Modalize>
        </SafeAreaView>
    );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
