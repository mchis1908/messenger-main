import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ref, update, onValue } from 'firebase/database';

const SocialPost = ({ postData }) => {
    const [isLiked, setIsLiked] = useState(false);
    const handleLike = () => {
        setIsLiked(!isLiked);
    }

    function timeAgo(timestamp) {
        const seconds = Math.floor((new Date() - timestamp) / 1000);
        const intervals = Math.floor(seconds / 31536000);
      
        if (intervals > 1) {
          return `${intervals} years ago`;
        }
        if (intervals === 1) {
          return `${intervals} year ago`;
        }
      
        const intervalsMonths = Math.floor(seconds / 2592000);
        if (intervalsMonths > 1) {
          return `${intervalsMonths} months ago`;
        }
        if (intervalsMonths === 1) {
          return `${intervalsMonths} month ago`;
        }
      
        const intervalsDays = Math.floor(seconds / 86400);
        if (intervalsDays > 1) {
          return `${intervalsDays} days ago`;
        }
        if (intervalsDays === 1) {
          return `${intervalsDays} day ago`;
        }
      
        const intervalsHours = Math.floor(seconds / 3600);
        if (intervalsHours > 1) {
          return `${intervalsHours} hours ago`;
        }
        if (intervalsHours === 1) {
          return `${intervalsHours} hour ago`;
        }
      
        const intervalsMinutes = Math.floor(seconds / 60);
        if (intervalsMinutes > 1) {
          return `${intervalsMinutes} minutes ago`;
        }
        if (intervalsMinutes === 1) {
          return `${intervalsMinutes} minute ago`;
        }
      
        return "Just now";
      }

    return (
        <View style={styles.postContainer}>
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
                <Image source={{ uri: postData.imageURL }} style={{ width: '100%', height: 200, borderRadius: 16 }} />
                <Text style={styles.postCaption}>{ postData.caption }</Text>
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
                    <Text>23</Text>
                </View>

                <View style={{ flexDirection: "column", justifyContent: "space-betwwen", alignItems: "center", height: "100%", marginTop: 5 }}>
                    <MaterialCommunityIcons name="comment-multiple-outline" size={20} color="black" />
                    <Text>1056</Text>
                </View>
            </View>
        </View>
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
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.29,
            shadowRadius: 4.65,

            elevation: 7,
        },
        postFooter: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            marginTop: 20,
            gap: 20,
            paddingLeft: 20,
        },
        postCaption: {
            fontSize: 16,
            fontWeight: "500",
            color: "black",
            marginTop: 10,
            marginLeft: 5
        }
    });

export default SocialPost;
