import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from '@expo/vector-icons';
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { EXPO_PUBLIC_URL } from '@env'
import axios from "axios";
import { ref, onValue, query, limitToLast, onChildAdded } from 'firebase/database';
import { REAL_TIME_DATABASE, FIREBASE_STORAGE } from "../FirebaseConfig";
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HoldItem } from "react-native-hold-menu";
import MessageItem from "../components/messageItem";
import { EvilIcons, MaterialIcons } from '@expo/vector-icons'; 
import { Modalize } from 'react-native-modalize';

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState('');
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { recepientId, conversationId } = route.params;
  var [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  var [imageURL, setImageURL] = useState("");
  var [selectedReply, setSelectedReply] = useState({})
  const scrollViewRef = useRef(null);
  const modalizeRef = useRef();
  const [recepientFriendListData, setRecepientFriendListData] = useState([]);
 
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 100);
  }

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  useEffect(() => {
    scrollToBottom()
  },[]);

  const handleContentSizeChange = () => {
      scrollToBottom();
  }

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const messagesRef = ref(REAL_TIME_DATABASE, `messages/${conversationId}`);
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMessages(Object.values(data));
        } else {
          setMessages([]);
        }
      });
    } catch (error) {
      console.log("error fetching messages in fetch all", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `${EXPO_PUBLIC_URL}/user/${recepientId}`
        );
        console.log("response", response)
        const data = await response.json();
        setRecepientData(data);
        console.log("recepient data", recepientId)
        
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, []);

  const handleSendMessage = (messageType) => {
    const timestamp = new Date()

    let payload = Object.keys(selectedReply).length > 0 ? {
      "conversationId": conversationId,
      "senderId": userId,
      "messageType": messageType,
      "message": messageType === "text" ? message : imageURL,
      "timestamp": timestamp.getTime(),
      "replyFor": selectedReply.message,
      "replyType": selectedReply.messageType,
    } : {
      "conversationId": conversationId,
      "senderId": userId,
      "messageType": messageType,
      "message": messageType === "text" ? message : imageURL,
      "timestamp": timestamp.getTime()
    }

    axios.post(`${EXPO_PUBLIC_URL}/message`, payload).then(() => {
      setMessage("");
      getLastMessage()
      setSelectedReply({})
    })
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const getLastMessage = () => {
    try {
      const messagesRef = query(ref(REAL_TIME_DATABASE, `messages/${conversationId}`), limitToLast(1), "timestamp");
      onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        messages.push(data)
      })
    } catch (error) {
      console.log("error fetching messages in lasttest", error);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectedMessages?.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages?.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={onOpen} style={{ borderWidth: 2, borderColor: "#A6CF98", padding: 2, borderRadius: "50%", alignItems: "center" }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: recepientData?.image }}
                />
              </Pressable>

              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () => (
          <Pressable>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Entypo name="dots-three-vertical" size={16} color="black" />
            </View>
          </Pressable>
        ) 
    });
  }, [recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_URL}/user/deleteMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.status === 200) {
        setSelectedMessages((prevSelectedMessages) =>
        prevSelectedMessages.filter((id) => !messageIds.includes(id))
      );

        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };
  

  const pickImage = async () => {
      const timestamp = new Date()
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const ref = storageRef(FIREBASE_STORAGE, `messages/${conversationId}/${timestamp.getTime()}`);
        const img = await fetch(result.assets[0].uri);
        const bytes = await img.blob();
        await uploadBytes(ref, bytes).then(async (snapshot) => {
          getDownloadURL(ref).then((url) => {
            setImageURL(url);
            imageURL = url
            console.log("image url", imageURL)
            if (imageURL.length > 0) {
              handleSendMessage("image");
            } else {
              console.log("There was an error uploading the image")
            }
          })
        }).catch((error) => {
          console.log("error uploading image", error)
        })
      }
  };

  function handleReply(message) {
    setSelectedReply(message)
    console.log("reply in chat", message)
  }

  async function handleDelete(message) {
    axios.post(`${EXPO_PUBLIC_URL}/message/delete`, {
      "conversationId": conversationId,
      "timestamp": message.timestamp
    })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange} style={styles.chatContainer}>
        {messages.map((item, index) => (
          <MessageItem item={item} key={item.timestamp} onReply={handleReply} onDelete={handleDelete}/>
        ))}
      </ScrollView>

      {
        Object.keys(selectedReply).length > 0 && (
          <View style={{ backgroundColor: "white", flexDirection: "column", gap: 10, alignItems: "center", paddingHorizontal: 15, paddingVertical: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderTopColor: "gray"}}>
            <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Octicons name="reply" size={16} color="#000" />
                <Text style={{ fontSize: 12, marginBottom: 5 }}>{`Replying to ${selectedReply.senderId === userId ? 'yourself' : recepientData.name}`}</Text>
              </View>

              <Pressable onPress={() => setSelectedReply({})} style={{ marginLeft: 10 }}>
                <EvilIcons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <View style={{ backgroundColor: "white", paddingLeft: 10, flexDirection: "row", width: "100%", justifyContent: "space-between", borderLeftWidth: 2.5, borderLeftColor: '#a6cf98' }}>
              {
                selectedReply.messageType === "text" ? (
                  <Text style={{ color: "darkgray" }}>{selectedReply?.message}</Text>
                ) : (
                  <Image source={{ uri: selectedReply.message }} style={{ width: 50, height: 70, borderRadius: 8 }}/>
                )
              }
            </View>
          </View>
        )
      }

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Ionicons onPress={pickImage} name="camera" size={24} color="gray" />

          <FontAwesome name="microphone" size={24} color="gray" />
        </View>

        {
          message && (
            <Pressable
              onPress={() => handleSendMessage("text")}
              style={{
                backgroundColor: "#557c55",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
              }}
            >
              <Ionicons name="md-send" size={16} color="#fff" />
            </Pressable>
          )
        }
      <Modalize ref={modalizeRef} modalTopOffset={500}>
        <View style={{ width: "100%", alignItems: "center", marginTop: 50, flexDirection: "column", gap: 10 }}>
          <Pressable style={{ borderWidth: 3, borderColor: "#739072", padding: 5, borderRadius: 60, alignItems: "center", width: 120, height: 120 }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                resizeMode: "cover",
              }}
              source={{ uri: recepientData?.image }}
            />

            <Text style={{ marginTop: 25, fontSize: 20, fontWeight: "bold", color: "#555843" }}>{recepientData?.name}</Text>
            <Text style={{ marginTop: 5, fontSize: 16, width: 300, textAlign: "center", color: "#7EAA92" }}>{recepientData?.email}</Text>
          </Pressable>
        </View>
      </Modalize>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
  chatContainer: {

  }
});
