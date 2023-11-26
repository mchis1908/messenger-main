import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ref as RealtimeRef, push, onValue, set, query, equalTo, runTransaction } from "firebase/database";
import { REAL_TIME_DATABASE } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { EXPO_PUBLIC_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { timeAgo } from '../constants';

const SocialPost = ({ postData }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [userData, setUserData] = useState({});
    const navigation = useNavigation();
    const [detailPost, setDetailPost] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedUserId = await AsyncStorage.getItem("userId");
            console.log("storedUserId", storedUserId)
            const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${storedUserId}`);
            console.log("response", response)
            setUserData(response.data);
            console.log("userData", userData)
          } catch (error) {
            console.log("Error:", error);
          }
        };
        fetchUserData();
      }, [postData]);

    const fetchDetailPost = () => {
        try {
          const postRef = RealtimeRef(REAL_TIME_DATABASE, `posts/${postData.id}`);
          onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            setDetailPost(data)
          })
        } catch (error) {
          console.log("Error:", error);
        }
      }

    useEffect(() => {
        fetchDetailPost();
    }, [postData]);

    useEffect(() => {
        if (detailPost && detailPost.likes) {
            const userLikedIndex = detailPost.likes.findIndex((like) => Object.keys(like).includes(userData.id));
            setIsLiked(userLikedIndex !== -1);
        }
        console.log("detailPost", isLiked)
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

    const handleNavigateDetailPost = () => {
        navigation.navigate("DetailPost", postData);
    }

    return (
        <Pressable onPress={handleNavigateDetailPost} style={styles.postContainer}>
            <View style={styles.postHeader}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
                    <Image source={{ uri: postData.authorImage }} style={{width: 50, height: 50, borderRadius: 50}}/>
                    <View>
                        <Text style={styles.postName}>{ postData.authorName }</Text>
                        <Text style={styles.postTime}>{ timeAgo(postData.timestamp) }</Text>
                    </View>
                </View>
                <Entypo name="dots-three-horizontal" size={16} color="black" />
            </View>

            <View style={styles.postContent}>
                {
                    postData.imageURL && (
                        <Image source={{ uri: postData.imageURL }} style={[{ width: '100%', height: 200, borderRadius: 16 }, styles.postImage]} />
                    )
                }
                {
                    postData.caption && (
                        <Text style={styles.postCaption}>{ postData.caption }</Text>
                    )
                }
            </View>

            <View style={styles.postFooter}>
                <View style={{ flexDirection: "column", justifyContent: "space-betwwen", alignItems: "center", height: "100%" }}>
                    {
                        isLiked ? (
                            <TouchableOpacity onPress={handleLike}>
                                <Ionicons name="heart-sharp" size={24} color="red" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={handleLike}>
                                <Ionicons name="heart-outline" size={24} color="black" />
                            </TouchableOpacity>
                        )
                    }
                    <Text>{ detailPost.likes ? detailPost.likes.length : 0 }</Text>
                </View>

                <View style={{ flexDirection: "column", justifyContent: "space-betwwen", alignItems: "center", height: "100%", marginTop: 5 }}>
                    <MaterialCommunityIcons name="comment-multiple-outline" size={20} color="black" />
                    <Text>{ detailPost.comments ? detailPost.comments.length : 0 }</Text>
                </View>
            </View>
        </Pressable>
      );
    };
    
    const styles = StyleSheet.create({
        postContainer: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: 20,
        },
        postHeader: {
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
        },
        postName: {
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
        },
        postTime: {
            fontSize: 14,
            fontWeight: "500",
            color: "gray",
        },
        postContent: {
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: 20,
        },
        postFooter: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            marginTop: 20,
            gap: 20,
        },
        postCaption: {
            fontSize: 16,
            fontWeight: "500",
            color: "black",
            marginTop: 10,
            marginLeft: 5
        },
        postImage: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
        }
    });

export default SocialPost;
