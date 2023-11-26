import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { EXPO_PUBLIC_URL } from '@env';
import { timeAgo } from '../constants';

export default function CommentItem({ commentData }) {
    const [authorData, setAuthorData] = useState({});
    useEffect(() => {
        const fetchAuthorData = async () => {
          try {
            const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${commentData.commentAuthorId}`);
            console.log("response", response)
            setAuthorData(response.data);
            console.log("userData", authorData)
          } catch (error) {
            console.log("Error:", error);
          }
        };
        fetchAuthorData();
    }, []);

    return (
        <View style={styles.comment}>
            <Image style={styles.commentAvatar} source={{ uri: authorData.image }}/>
            <View style={styles.commentBody}>
                <View style={styles.commentContent}>
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: "black" }}>{ authorData.name }</Text>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>{ commentData.commentContent }</Text>
                </View>
                <Text style={{ fontSize: 10, fontWeight: "500", color: "gray", marginLeft: 10 }}>{ timeAgo(commentData.timestamp) }</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
    }, commentContent: {
        width: "80%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 5,
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#EEECDA",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    commentBody: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 5,
        width: "100%"
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#557C55"
    },
})