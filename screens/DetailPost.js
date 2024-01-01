import { View, Text, SafeAreaView, Image, TouchableOpacity, Pressable, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { timeAgo } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REAL_TIME_DATABASE } from "../FirebaseConfig";
import { ref as RealtimeRef, onValue, runTransaction } from "firebase/database";
import { EXPO_PUBLIC_URL } from '@env';
import { TextInput } from 'react-native-gesture-handler';
import CommentItem from '../components/commentItem';

export default function DetailPost() {
    const route = useRoute()
    const postData = route.params
    const navigation = useNavigation()
    const [isLiked, setIsLiked] = useState(false);
    const [userData, setUserData] = useState({});
    const [detailPost, setDetailPost] = useState({})
    const [isOpenComment, setIsOpenComment] = useState(false)
    const [comment, setComment] = useState('')
    const [allComments, setAllComments] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("userId");
            console.log("storedUserId", storedUserId)
            const response = await fetch(`${EXPO_PUBLIC_URL}/user/${storedUserId}`)
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
            console.log("userData in details post", userData)
          } catch (error) {
            console.log("Error:", error);
          }
        };
        fetchUserData();
        fetchDetailPost()
      }, []);

      const fetchDetailPost = () => {
        try {
          const postRef = RealtimeRef(REAL_TIME_DATABASE, `posts/${postData.id}`);
          onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            setDetailPost(data)
            setAllComments(data.comments)
          })
        } catch (error) {
          console.log("Error:", error);
        }
      }

      useEffect(() => {
        if (detailPost && detailPost.likes) {
            const userLikedIndex = detailPost.likes.findIndex((like) => Object.keys(like).includes(userData.id));
            setIsLiked(userLikedIndex !== -1);
        }
    }, [detailPost, userData]);

    const handleLike = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            setIsLiked(!isLiked);
    
            const interactionsRef = RealtimeRef(REAL_TIME_DATABASE, `posts/${postData.id}`);
            await runTransaction(interactionsRef, (interactions) => {
                if (!interactions) {
                    interactions = {};
                }
    
                if (!interactions.likes) {
                    interactions.likes = [];
                }
    
                const userLikedIndex = interactions.likes.findIndex((like) => like[storedUserId]);
    
                if (!isLiked) {
                    if (userLikedIndex === -1) {
                        interactions.likes.push({ [storedUserId]: userData.name });
                    }
                } else {
                    if (userLikedIndex !== -1) {
                        interactions.likes.splice(userLikedIndex, 1);
                    }
                }
    
                return interactions;
            });
    
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };

    const handeComment = async () => {
        const timestamp = new Date();
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            setComment('')
    
            const interactionsRef = RealtimeRef(REAL_TIME_DATABASE, `posts/${postData.id}`);
            await runTransaction(interactionsRef, (interactions) => {
                if (!interactions) {
                    interactions = {};
                }
    
                if (!interactions.comments) {
                    interactions.comments = [];
                }
    
                interactions.comments.push({ 
                    commentAuthorId: storedUserId,
                    commentContent: comment,
                    timestamp: timestamp.getTime()
                });
    
                return interactions;
            });
    
        } catch (error) {
            console.error("Error handling like:", error);
        }
    }

    const handleGoBack = () => {
        navigation.navigate("MainScreen")
    }

    const handleOpenComment = () => {
        setIsOpenComment(!isOpenComment)
    }
    console.log("userData", userData)

    return (
        <SafeAreaView>
            <View style={styles.postHeader}>
                <Pressable onPress={handleGoBack}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </Pressable>
                <View style={styles.postAuthorInfo}>
                    <Image style={styles.postAuthorImage} source={{ uri: detailPost?.authorImage }}/>
                    <View style={styles.postAuthorNameContainer}>
                        <Text style={styles.postAuthorName}>{detailPost?.authorName}</Text>
                        <Text style={styles.postTimestamp}>{ timeAgo(detailPost?.timestamp) }</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={{ marginBottom: 60 }}>
                <View style={styles.postBody}>
                    {
                        detailPost?.caption && (
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "500" }}>{detailPost?.caption}</Text>
                        )
                    }
                    {
                        detailPost?.imageURL && (
                            <Image source={{ uri: detailPost?.imageURL }} style={{ width: "100%", height: 300, borderRadius: 8 }}/>
                        )
                    }

                    <View style={styles.totalInteraction}>
                        <View style={styles.postTotalLike}>
                            <Ionicons name="heart-sharp" size={24} color="red" />
                            <Text>{ detailPost?.likes ? detailPost.likes.length : 0 }</Text>
                        </View>

                        <View style={styles.postTotalLike}>
                            <Entypo name="chat" size={22} color="#105652" />
                            <Text>{ detailPost?.comments ? detailPost.comments.length : 0 }</Text>
                        </View>
                    </View>

                    <View style={styles.hrTag}></View>

                    <View style={styles.postAction}>
                        <TouchableOpacity onPress={handleLike} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", borderRightWidth: 1, width: "50%", gap: 10, paddingVertical: 5, borderColor: "gray" }}>
                            {
                                isLiked ? (
                                    <View >
                                        <Ionicons name="heart-sharp" size={24} color="red" />
                                    </View>
                                ) : (
                                    <View >
                                        <Ionicons name="heart-outline" size={24} color="black" />
                                    </View>
                                )
                            }
                            <Text style={isLiked ? { color: "black" } : { color: "gray" }}>Like</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleOpenComment} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", borderLeftWidth: 1, width: "50%", gap: 10, paddingVertical: 5, borderColor: "gray" }}>
                            <MaterialCommunityIcons name="comment-multiple-outline" size={20} color="black" />
                            <Text>Comment</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.postFooter}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>All comments</Text>

                    {
                        isOpenComment && (
                            <View style={styles.commentContainer}>
                                <Image style={styles.commentAvatar} source={{ uri: userData?.image }}/>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                    <TextInput value={comment} onChangeText={(value) => setComment(value)} style={[styles.commentInput, comment.length == 0 && { width: '90%' }]} placeholder='Write a comment...'></TextInput>
                                    {
                                        comment.length > 0 && (
                                            <Pressable onPress={handeComment} style={{ width: 35, height: 35, borderRadius: 10, backgroundColor: "#557c55", justifyContent: "center", alignItems: "center" }}>
                                                <Feather name="send" size={20} color="#fff" />
                                            </Pressable>
                                        )
                                    }
                                </View>
                            </View>
                        )
                    }
                    <View style={styles.allCommentContainer}>
                        {
                            (allComments && allComments.length > 0) ? allComments.map((comment, index) => (
                                <CommentItem key={index} commentData={comment} />
                            )) : (
                                <View style={styles.noCommentContainer}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "gray" }}>No comments yet.</Text>
                                    <Text style={{ color: "gray" }}>Be the first one to comment.</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    postHeader: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: "#D0D0D0",
        gap: 20,
    },
    postAuthorImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#557C55"
    },
    postAuthorInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10
    },
    postAuthorName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black"
    },
    postBody: {
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        gap: 10
    },
    postAuthorNameContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    postTimestamp: {
        fontSize: 12,
        fontWeight: "500",
        color: "#8C8C8C"
    },
    postAction: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    postTotalLike: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
    },
    hrTag: {
        width: "100%",
        height: 1,
        backgroundColor: "#D0D0D0",
    },
    postFooter: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 20
    },
    commentContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
    },
    commentInput: {
        width: "80%",
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D0D0D0",
        paddingHorizontal: 10,
    },
    allCommentContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
    },
    totalInteraction: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#557C55"
    },
    noCommentContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
    }
})