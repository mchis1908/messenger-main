import { StyleSheet, Text, View, Pressable, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useContext, useState, useRef } from "react";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { EXPO_PUBLIC_URL } from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import User from "../components/User";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Modalize } from "react-native-modalize";

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [originalUserList, setOriginalUserList] = useState([]);
    const [openQrCodeScanner, setOpenQrCodeScanner] = useState(false);
    const [friendData, setFriendData] = useState(null);
    const [friendId, setFriendId] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [userData, setUserData] = useState({});
    const modalizeRef = useRef()

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("userId");
            setUserId(storedUserId);
    
            const response = await fetch(`${EXPO_PUBLIC_URL}/user/${userId}`)
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                
            }
          } catch (error) {
            console.log("Error:", error);
          }
        };
        fetchUserData();
      }, [userId]);

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");
            console.log("storedUserId", storedUserId)
            setUserId(storedUserId);
        };
        fetchUserId();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${EXPO_PUBLIC_URL}/user/all/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setOriginalUserList(data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    function handleSearchFriends(value) {
        if (value.length > 0) {
            const filteredFriends = users.filter((item) => {
                return item.name.toLowerCase().includes(value.toLowerCase())
            });
            setUsers(filteredFriends);
        } else {
            setUsers(originalUserList);
        }
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        console.log("aaaaaa", data)

        const response = await fetch(`${EXPO_PUBLIC_URL}/user/${data}`);
        if (response.ok) {
            const data = await response.json();
            setFriendData(data);
            modalizeRef.current?.open();
        }
        setOpenQrCodeScanner(false);
    }

    function activateScanner() {
        setOpenQrCodeScanner(true)
    }

    async function handleAddFriend() {
        try {
            const response = await fetch(`${EXPO_PUBLIC_URL}/user/friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    currentUserId: userId,
                    selectedUserId: friendData.id
                }),
            });

            if (response.ok) {
                await fetchData();
                await modalizeRef.current?.close();
            }
        } catch (error) {
            console.log("error message", error);
        }
    }

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const userId = await AsyncStorage.getItem("userId");
            try {
                const response = await fetch(`${EXPO_PUBLIC_URL}/user/friend-request/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFriendRequests(data);
                }
            } catch (err) {
                console.log("error message friend", err);
            }
        };
        if (userId) {
            fetchFriendRequests();
        }
    }, [userId]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 20, alignSelf: "flex-start" }}>Friends</Text>
                <Pressable onPress={activateScanner} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 30 }}>
                    <TextInput onChangeText={handleSearchFriends} style={{ width: "90%", height: 40, borderWidth: 1, borderColor: "gray", borderRadius: 8, padding: 10 }} placeholder="Search friends..." />
                    <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                </Pressable>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
                {users.map((item, index) => (
                    <User key={index} item={item} />
                ))}
            </View>


            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 20, alignSelf: "flex-start" }}>Friend Requests</Text>
            </View>
            <View style={{ padding: 10, marginHorizontal: 12 }}>
                {
                    friendRequests.length > 0 ? (
                        friendRequests.map((item, index) => (
                            <FriendRequest
                                key={index}
                                item={item}
                                friendRequests={friendRequests}
                                setFriendRequests={setFriendRequests}
                            />
                        ))
                    ) : (
                        <Text style={{ fontSize: 20, textAlign: "center" }}>
                            No Friend Requests!
                        </Text>
                    )
                }
            </View>

            {
                friendData && (
                    <Modalize ref={modalizeRef} modalTopOffset={400}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold", width: "100%", paddingVertical: 20 }}>Add friend</Text>
                            <View style={{ flexDirection: "row", gap: 20 }}>
                                <Image style={styles.friendAvatar} source={{ uri: friendData.image }} />
                                <View style={styles.friendBody}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>{friendData.name}</Text>
                                    <Text style={{ fontSize: 15, fontWeight: "500", color: "gray" }}>{friendData.email}</Text>
                                </View>
                            </View>
                            {
                                userData.friends.includes(friendData.id) ? (
                                    <Pressable
                                        style={{
                                            backgroundColor: "#82CD47",
                                            padding: 10,
                                            borderRadius: 6,
                                            marginTop: 20,
                                            width: "100%",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 5
                                        }}
                                    >
                                        <Text style={{ textAlign: "center", color: "white" }}>Friend</Text>
                                        <AntDesign name="check" size={16} color="white" />
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={handleAddFriend}
                                        style={{
                                            backgroundColor: "#567189",
                                            padding: 10,
                                            borderRadius: 6,
                                            marginTop: 20,
                                            width: "100%"
                                        }}
                                    >
                                        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                                            Add Friend
                                        </Text>
                                    </Pressable>
                                )
                            }
                        </View>
                    </Modalize>
                )
            }
            {
                openQrCodeScanner && (
                    <BarCodeScanner
                        onBarCodeScanned={handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject} />
                )
            }
        </SafeAreaView>
    );
};

export default FriendsScreen;

const styles = StyleSheet.create({
    friendCard: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    }, friendAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#43766C",
    }, friendBody: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 5,
    }
});
