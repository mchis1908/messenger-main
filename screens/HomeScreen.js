import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import React, {useEffect, useState, useContext, useRef } from "react";
import { UserType } from "../UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import SocialPost from "../components/socialPost";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Modalize } from "react-native-modalize";
import axios from "axios";
import { EXPO_PUBLIC_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { REAL_TIME_DATABASE, FIREBASE_STORAGE } from "../FirebaseConfig";
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";
import { set, ref as RealtimeRef, push, onValue } from "firebase/database";

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [userData, setUserData] = useState({});
  const modalizeRef = useRef()
  const sampleArray = [1,2,3,4,5,6,7,8,9,10];
  const [image, setImage] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const response = await axios.get(`${EXPO_PUBLIC_URL}/user/${storedUserId}`);
        setUserData(response.data);
        console.log("userData", userData)
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchUserData();
  }, [userId]);

    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const deselectImage = () => {
        setImage(null);
    }

    const fetchPosts = () => {
        try {
          const postRef = RealtimeRef(REAL_TIME_DATABASE, `posts`);
          onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const postsWithId = Object.keys(data).map((postId) => ({
                id: postId,
                ...data[postId],
              }));
              setAllPosts(postsWithId);
              console.log("data all posts", postsWithId);
            } else {
              setAllPosts([]);
            }
          });
        } catch (error) {
          console.log("error fetching posts", error);
        }
    };
      
    
      useEffect(() => {
        fetchPosts();
      }, []);

    const handlePost = async () => {
        const timestamp = new Date();
        try {
            const postData = {
                caption: postContent,
                imageURL: "",
                userId: userData.id,
                timestamp: Date.now(),
                authorName: userData.name,
                authorImage: userData.image,
                interactions: {
                    likes: [],
                    comments: [],
                }
            };
    
            if (image) {
                const ref = storageRef(FIREBASE_STORAGE, `posts/${userData.id}/${timestamp.getTime()}`);
                const img = await fetch(image);
                const bytes = await img.blob();
    
                const snapshot = await uploadBytes(ref, bytes);
                postData.imageURL = await getDownloadURL(ref);
            }
    
            await push(RealtimeRef(REAL_TIME_DATABASE, 'posts'), postData);
    
            setPostContent('');
            setImage(null);
            modalizeRef.current?.close();
        } catch (error) {
            console.error("Error handling post:", error);
        }
    };
    
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 110 }}>
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 20 }}>
            <Text style={{fontSize:30,fontWeight:'bold',padding:20, alignSelf: "flex-start"}}>NewsFeed</Text>
            <Pressable onPress={() => modalizeRef.current?.open()}>
                <AntDesign name="pluscircleo" size={24} color="black" />
            </Pressable>
        </View>
        <ScrollView style={{ width: "100%", paddingHorizontal: '5%' }}>
        {
            allPosts.map((item, index) => (
                <SocialPost key={index} postData={item}/>
            ))
        }
        </ScrollView>
      </View>

      <Modalize ref={modalizeRef}>
        <View style={styles.modalTitle}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Create Post</Text>
        </View>

        <View style={styles.modalBody}>
            <View style={styles.bodyHeader}>
                <View style={{ width: 70, height: 70, flexDirection: "row", borderRadius: 70, borderWidth: 2, justifyContent: "center", alignItems: "center", borderColor: "#7AA874" }}>
                    <Image source={{ uri: userData?.image }} style={ styles.postAvatar }/>
                </View>

                <View>
                    <Text style={styles.postName}>{ userData.name }</Text>
                </View>
            </View>

            <View style={styles.bodyContent}>
                <View style={styles.inputContent}>
                    <TextInput onChangeText={(text) => setPostContent(text)} value={postContent} style={{ width: "90%", paddingLeft: 20 }} placeholder={`What's in your mind, ${userData.name}?`}/>
                    <Pressable onPress={openImagePicker}>
                        <MaterialIcons name="perm-media" size={24} color="gray" />
                    </Pressable>
                </View>

                {
                    image && (
                        <View style={{ width: "100%", marginTop: 20, position: "relative" }}>
                            <Image source={{ uri: image }} style={{ width: "100%", height: 300, borderRadius: 8 }}/>
                            <Pressable onPress={deselectImage} style={{ position: "absolute", right: -10, top: -10 }}>
                                <AntDesign name="closecircleo" size={24} color="black" />
                            </Pressable>
                        </View>
                    )
                }
            </View>
        </View>

        <View style={styles.modalFooter}>
            <Pressable onPress={handlePost} style={{ width: "50%", height: 50, backgroundColor: "#508D69", borderRadius: 20, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>Post</Text>
            </Pressable>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    modalTitle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    modalBody: {
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
    },
    postAvatar: {
        width: 60,
        height: 60,
        borderRadius: 60,
        borderWidth: 1,
    },
    bodyHeader: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 10
    },
    postName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    bodyContent: {
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
    imageInput: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    modalFooter: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 40
    },
    inputContent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        height: 50,
        paddingRight: 20,
    }
});
