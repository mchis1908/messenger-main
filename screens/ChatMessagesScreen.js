import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TextInput,
	Pressable,
	Image,
    TouchableOpacity,
} from "react-native";
import React, {
	useState,
	useContext,
	useLayoutEffect,
	useEffect,
	useRef,
} from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { EXPO_PUBLIC_URL } from "@env";
import axios from "axios";
import {
	ref,
	onValue,
	query,
	limitToLast,
	onChildAdded,
    set,
} from "firebase/database";
import {
	REAL_TIME_DATABASE,
	FIREBASE_STORAGE,
	FIREBASE_FIRESTORE,
    FIREBASE_APP,
} from "../FirebaseConfig";
import {
	getDownloadURL,
	uploadBytes,
	ref as storageRef,
    getStorage,
} from "firebase/storage";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HoldItem } from "react-native-hold-menu";
import MessageItem from "../components/messageItem";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import GroupMemberItem from "../components/groupMemberItem.js";

const ChatMessagesScreen = () => {
	const [showEmojiSelector, setShowEmojiSelector] = useState(false);
	const [messages, setMessages] = useState([]);
	const [recepientData, setRecepientData] = useState();
	const navigation = useNavigation();
	const route = useRoute();
	const { recepientId, conversationId, groupInfor, type } = route.params;
	var [message, setMessage] = useState("");
	const { userId, setUserId } = useContext(UserType);
	var [imageURL, setImageURL] = useState("");
	var [selectedReply, setSelectedReply] = useState({});
	var [selectedPin, setSelectedPin] = useState({});
	const scrollViewRef = useRef(null);
	const modalizeRef = useRef();
    const modalChangeNameImageGroupRef = useRef();
    const groupMemberModalRef = useRef();
	const defaultAvatarUrl =
		"https://firebasestorage.googleapis.com/v0/b/talk-time-23c0d.appspot.com/o/assets%2Fdefault-group-avatar.png?alt=media&token=2ffdbd3f-d88d-4763-aa88-0cd9608b25c2";
	const defaultGroupName = "Group Chat";
    const [nameGroup, setNameGroup] = useState("");

	const scrollToBottom = () => {
		setTimeout(() => {
			scrollViewRef.current.scrollToEnd({ animated: true });
		}, 100);
	};

	const onOpen = () => {
		modalizeRef.current?.open();
	};

    const handleOpenModalChangeNameImage = () => {
        modalizeRef.current?.close()
        modalChangeNameImageGroupRef.current?.open();
    }

    const handleShowGroupMembers = () => {
        modalizeRef.current?.close()
        groupMemberModalRef.current?.open();
    }

	useEffect(() => {
		scrollToBottom();
	}, []);

	const handleContentSizeChange = () => {
		scrollToBottom();
	};

	const handleEmojiPress = () => {
		setShowEmojiSelector(!showEmojiSelector);
	};

	const fetchMessages = async () => {
		try {
			const messagesRef = ref(
				REAL_TIME_DATABASE,
				`messages/${conversationId}`
			);
			onValue(messagesRef, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					setMessages(Object.values(data));
					console.log("messages", messages, conversationId);
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
		// async function fetchConversation(){
		//   try {
		//     const conversationDocRef = doc(FIREBASE_FIRESTORE, "conversations", conversationId);
		//     const conversationSnapshot = await getDoc(conversationDocRef);
		//     if (conversationSnapshot.exists()) {
		//       const res = conversationSnapshot.data();
		//       setSelectedPin(res?.pinMessage?.message)
		//     } else {
		//       console.log("Conversation does not exist");
		//     }
		//   } catch (error) {
		//     console.error("Error fetching conversation:", error);
		//   }
		// }

		// fetchConversation()
	}, []);

	useEffect(() => {
		const fetchRecepientData = async () => {
			console.log("type", type);
			if (type === "individual") {
				try {
					const response = await fetch(
						`${EXPO_PUBLIC_URL}/user/${recepientId}`
					);
					console.log("response", response);
					const data = await response.json();
					setRecepientData(data);
					console.log("recepient data", recepientId);
				} catch (error) {
					console.log("error retrieving details", error);
				}
			} else {
				setRecepientData({
					image: groupInfor?.groupAvatar
						    ? groupInfor?.groupAvatar
						    : defaultAvatarUrl,
					name: groupInfor?.groupName
						    ? groupInfor?.groupName
						    : defaultGroupName,
				});
			}
		};

		fetchRecepientData();
	}, []);

	const handleSendMessage = (messageType) => {
		const timestamp = new Date();

		let payload =
			Object.keys(selectedReply).length > 0
				? {
						conversationId: conversationId,
						senderId: userId,
						messageType: messageType,
						message: messageType === "text" ? message : imageURL,
						timestamp: timestamp.getTime(),
						replyFor: selectedReply.message,
						replyType: selectedReply.messageType,
				  }
				: {
						conversationId: conversationId,
						senderId: userId,
						messageType: messageType,
						message: messageType === "text" ? message : imageURL,
						timestamp: timestamp.getTime(),
				  };

		axios.post(`${EXPO_PUBLIC_URL}/message`, payload).then(() => {
			setMessage("");
			getLastMessage();
			setSelectedReply({});
		});
	};

	const getLastMessage = () => {
		try {
			const messagesRef = query(
				ref(REAL_TIME_DATABASE, `messages/${conversationId}`),
				limitToLast(1),
				"timestamp"
			);
			onChildAdded(messagesRef, (snapshot) => {
				const data = snapshot.val();
				messages.push(data);
			});
		} catch (error) {
			console.log("error fetching messages in lasttest", error);
		}
	};

	const handleNavigateMedia = () => {
		navigation.navigate("ManageMedia", {
			conversationId: conversationId,
		});
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "",
			headerLeft: () => (
				<View style={{ flexDirection: "column", gap: 7 }}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Ionicons
							onPress={() => navigation.navigate("MainScreen", {
                                reload: true
                            })}
							name="arrow-back"
							size={24}
							color="black"
						/>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Pressable
								onPress={onOpen}
								style={{
									borderWidth: 2,
									borderColor: "#A6CF98",
									padding: 2,
									borderRadius: "50%",
									alignItems: "center",
								}}
							>
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

							<Text
								style={{
									marginLeft: 5,
									fontSize: 15,
									fontWeight: "bold",
								}}
							>
								{recepientData?.name}
							</Text>
						</View>
					</View>
					{selectedPin?.message === "" ? (
						<View></View>
					) : (
						<View
							style={{
								backgroundColor: "#fff",
								flexDirection: "row",
								gap: 20,
								justifyContent: "start",
								alignItems: "center",
								paddingHorizontal: 10,
								minHeight: 55,
								width: "100%",
							}}
						>
							<AntDesign
								name="message1"
								size={24}
								color="#A6CF98"
							/>
							<View
								style={{
									flexDirection: "row",
									gap: 10,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{ fontSize: 15, color: "#ADADAD" }}
								>
									{selectedPin?.messageType === "text"
										? "Message"
										: "Image"}
									:
								</Text>
								{selectedPin?.messageType === "text" ? (
									<Text style={{ fontSize: 15 }}>
										{selectedPin?.message}
									</Text>
								) : (
									<Image
										style={{
											width: 50,
											height: 50,
											borderRadius: 5,
										}}
										source={{ uri: selectedPin?.message }}
									/>
								)}
							</View>
						</View>
					)}
				</View>
			),
			headerRight: () => (
				<Pressable onPress={() => handleNavigateMedia()}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Entypo name="folder-images" size={24} color="black" />
					</View>
				</Pressable>
			),
		});
	}, [recepientData, selectedPin]);

	function getUsernameByUserId(senderId) {
		const targetUser = groupInfor.participants.find(
			(user) => user.id === senderId
		);
		if (targetUser) {
			return targetUser.name;
		} else {
			return null;
		}
	}

	function getImageByUserId(senderId) {
		const targetUser = groupInfor.participants.find(
			(user) => user.id === senderId
		);
		if (targetUser) {
			return targetUser.image;
		} else {
			return null;
		}
	}

	const pickImage = async () => {
		const timestamp = new Date();
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const ref = storageRef(
				FIREBASE_STORAGE,
				`messages/${conversationId}/${timestamp.getTime()}`
			);
			const img = await fetch(result.assets[0].uri);
			const bytes = await img.blob();
			await uploadBytes(ref, bytes)
				.then(async (snapshot) => {
					getDownloadURL(ref).then((url) => {
						setImageURL(url);
						imageURL = url;
						console.log("image url", imageURL);
						if (imageURL.length > 0) {
							handleSendMessage("image");
						} else {
							console.log(
								"There was an error uploading the image"
							);
						}
					});
				})
				.catch((error) => {
					console.log("error uploading image", error);
				});
		}
	};

    const handleUpdateGroupName = async () => {
        if (nameGroup) {
            const userDocRef = doc(FIREBASE_FIRESTORE, "conversations", conversationId);
            const updateData = {
                groupName: nameGroup,
            };

            setDoc(userDocRef, updateData, { merge: true }).then(() => {
                delete recepientData.name;
                setRecepientData({
                    ...recepientData,
                    name: nameGroup,
                })
            })
            await modalChangeNameImageGroupRef.current?.close();
        } else {
            alert("Please enter group name!")
        }
    }

	function handleReply(message) {
		setSelectedReply(message);
		console.log("reply in chat", message);
	}

	async function handleDelete(message) {
		axios.post(`${EXPO_PUBLIC_URL}/message/delete`, {
			conversationId: conversationId,
			timestamp: message.timestamp,
		});
	}

	async function handlePin(message) {
		await axios.patch(`${EXPO_PUBLIC_URL}/conversation/pinMessage`, {
			conversationId: conversationId,
			message: message,
		});
		setSelectedPin(message);
		console.log("pinMessage", message);
	}

	function renderMessages() {
		if (type === "individual") {
			return messages.map((item, index) => (
				<MessageItem
					item={item}
					key={item.timestamp}
					onReply={handleReply}
					onDelete={handleDelete}
				/>
			));
		} else if (type === "group") {
			return messages.map((item, index) => (
				<View key={index}>
					<Text
						style={[
							item.senderId === userId
								? { alignSelf: "flex-end", marginRight: 10 }
								: { alignSelf: "flex-start", marginLeft: 40 },
							styles.groupChatSenderName,
						]}
					>
						{getUsernameByUserId(item.senderId)}
					</Text>
					{item.senderId === userId ? (
						<MessageItem
							item={item}
							key={item.timestamp}
							onReply={handleReply}
							onDelete={handleDelete}
						/>
					) : (
						<View style={{ flexDirection: "row" }}>
							<Image
								style={{
									borderWidth: 1,
									width: 30,
									height: 30,
									alignSelf: "center",
									borderRadius: 15,
								}}
								source={{
									uri: getImageByUserId(item.senderId),
								}}
							/>
							<MessageItem
								item={item}
								key={item.timestamp}
								onReply={handleReply}
								onDelete={handleDelete}
							/>
						</View>
					)}
				</View>
			));
		}
	}

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
            const storage = getStorage(FIREBASE_APP);
            const db = getFirestore(FIREBASE_APP);
        
            const fileName = `${conversationId}.jpg`;
            const storageRefe = storageRef(storage, `group_conversation_image/${fileName}`);
            console.log("userDocRef")
            try {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                const uploadTask = uploadBytes(storageRefe, blob);
        
                await uploadTask;
        
                const url = await getDownloadURL(storageRefe);
        
                const userDocRef = doc(db, "conversations", conversationId);
                const updateData = {
                    groupAvatar: url,
                };
        
                await updateDoc(userDocRef, updateData);
                delete recepientData.image;
        
                setRecepientData({
                    ...recepientData,
                    image: url,
                })
                await modalChangeNameImageGroupRef.current?.close();
            } catch (error) {
                console.error("Error during image upload:", error);
            }
        }
      };

	return (
		<KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
				onContentSizeChange={handleContentSizeChange}
				style={styles.chatContainer}
			>
				{renderMessages()}
			</ScrollView>

			{Object.keys(selectedReply).length > 0 && (
				<View
					style={{
						backgroundColor: "white",
						flexDirection: "column",
						gap: 10,
						alignItems: "center",
						paddingHorizontal: 15,
						paddingVertical: 8,
						borderTopRightRadius: 8,
						borderTopLeftRadius: 8,
						borderTopColor: "gray",
					}}
				>
					<View
						style={{
							alignSelf: "flex-start",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<View style={{ flexDirection: "row", gap: 10 }}>
							<Octicons name="reply" size={16} color="#000" />
							<Text
								style={{ fontSize: 12, marginBottom: 5 }}
							>{`Replying to ${
								selectedReply.senderId === userId
									? "yourself"
									: recepientData.name
							}`}</Text>
						</View>

						<Pressable
							onPress={() => setSelectedReply({})}
							style={{ marginLeft: 10 }}
						>
							<EvilIcons name="close" size={24} color="black" />
						</Pressable>
					</View>
					<View
						style={{
							backgroundColor: "white",
							paddingLeft: 10,
							flexDirection: "row",
							width: "100%",
							justifyContent: "space-between",
							borderLeftWidth: 2.5,
							borderLeftColor: "#a6cf98",
						}}
					>
						{selectedReply.messageType === "text" ? (
							<Text style={{ color: "darkgray" }}>
								{selectedReply?.message}
							</Text>
						) : (
							<Image
								source={{ uri: selectedReply.message }}
								style={{
									width: 50,
									height: 70,
									borderRadius: 8,
								}}
							/>
						)}
					</View>
				</View>
			)}

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
					<Ionicons
						onPress={pickImage}
						name="camera"
						size={24}
						color="gray"
					/>

					<FontAwesome name="microphone" size={24} color="gray" />
				</View>

				{message && (
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
				)}
				<Modalize ref={modalizeRef} modalTopOffset={100}>
					<View style={{ width: "100%", alignItems: "center", marginTop: 20, flexDirection: "column", gap: 10 }}>
						<Pressable style={{ borderWidth: 3, borderColor: "#739072", padding: 5, borderRadius: 60, alignItems: "center", width: 120, height: 120, justifyContent: "center" }}>
							<Image
								style={{ width: 100, height: 100, borderRadius: 50, resizeMode: "cover" }}
								source={{ uri: recepientData?.image }}
							/>
						</Pressable>
                        <Text style={{ marginTop: 25, fontSize: 20, fontWeight: "bold", color: "#555843" }}>
                            {recepientData?.name}
                        </Text>
                        <Text
                            style={{ marginTop: 5, fontSize: 16, width: 300, textAlign: "center", color: "#7EAA92" }}>
                            {recepientData?.email}
                        </Text>
                        {
                            type === "group" && (
                                <View style={{ flexDirection: "column", marginTop: -30, width: "100%", paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={styles.buttonSettings} onPress={handleOpenModalChangeNameImage}>
                                        <Text style={{ color: "#fff" }}>Change name or image</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.buttonSettings} onPress={handleShowGroupMembers}>
                                        <Text style={{ color: "#fff" }}>See groups members</Text>
                                    </TouchableOpacity>
                                </View>

                            )
                        }
					</View>
				</Modalize>

                <Modalize ref={modalChangeNameImageGroupRef} modalTopOffset={400}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 20, paddingVertical: 20 }}>
                        <View style={{ borderWidth: 3, borderColor: "#739072", padding: 5, borderRadius: 60, alignItems: "center", width: 120, height: 120, position: "relative" }}>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: "cover" }}
                                source={{ uri: recepientData?.image }}
                            />

                            <TouchableOpacity onPress={handleImageUpload} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#739072", borderRadius: 50, padding: 10, bottom: 0, right: -12 }}>
                                <Ionicons name="ios-camera" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <TextInput onChangeText={(name) => setNameGroup(name)} style={styles.inputChangeName} placeholder="Group chat name"/>

                        <TouchableOpacity onPress={handleUpdateGroupName} style={styles.buttonUpdate}>
                            <Text style={{ color: "#fff", fontSize: 20 }}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </Modalize>

                <Modalize ref={groupMemberModalRef} modalTopOffset={200}>
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", width: "100%", textAlign: "center" }}>Group Members</Text>
                        {
                            groupInfor?.participants.map((member, index) => (
                                <GroupMemberItem key={index} memberInfo={member}/>
                            ))
                        }
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
	groupChatSenderName: {
		fontSize: 12,
		color: "gray",
		marginBottom: -5,
	},
    inputChangeName: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#d6d6d6",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: 20
    },
    buttonUpdate: {
        width: "100%",
        height: 50,
        backgroundColor: "#739072",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonSettings: {
        width: "100%",
        height: 50,
        backgroundColor: "#739072",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    }
});
