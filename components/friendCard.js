import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EXPO_PUBLIC_URL } from '@env';

export default function FriendCard({ friendId }) {
    const [friendData, setFriendData] = useState({});

    useEffect(() => {
        async function fetchFriendData() {
            try {
                const response = await fetch(`${EXPO_PUBLIC_URL}/user/${friendId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("friendData", data)
                    setFriendData(data);
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }

        fetchFriendData();
    }, [friendId]);

    return (
        <View>
            {
                Object.keys(friendData).length > 0 && (
                    <View style={styles.friendCard}>
                        <>
                            <Image style={styles.friendAvatar} source={{ uri: friendData.image }}/>
                            <View style={styles.friendBody}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", color: "black" }}>{ friendData.name }</Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>{ friendData.email }</Text>
                            </View>
                        </>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    friendCard: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    }, friendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }, friendBody: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 5,
    }
})