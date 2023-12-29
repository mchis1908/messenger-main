import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import React, { useLayoutEffect, useEffect, useState } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import { Ionicons } from "@expo/vector-icons";
  import { FIREBASE_STORAGE } from "../FirebaseConfig";
  import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
  import { ActivityIndicator } from "react-native";
  import ImageZoom from "react-native-image-pan-zoom";
  
  const ManageMedia = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { conversationId } = route.params;
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchImages = async () => {
        try {
          if (!conversationId) {
            setImages([]);
            setIsLoading(false);
            return;
          }
  
          const storageRef = ref(FIREBASE_STORAGE, `messages/${conversationId}`);
          const items = await listAll(storageRef);
  
          const imageDetails = await Promise.all(
            items.items.map(async (item) => {
              const url = await getDownloadURL(item);
              const metadata = await getMetadata(item);
  
              return {
                url,
                createdAt: metadata.timeCreated,
              };
            })
          );
          imageDetails.reverse();
  
          setImages(imageDetails);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching images from storage:", error);
          setIsLoading(false);
        }
      };
  
      fetchImages();
    }, [conversationId]);
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: "Manage Media File",
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
          </View>
        ),
      });
    }, [navigation]);
  
    const renderImageRow = ({ item }) => (
      <View style={styles.imageRow}>
        {item.map((image) => (
          <TouchableOpacity
            key={image.url}
            style={styles.imageContainer}
            onPress={() => navigateToZoomedImage(image.url)}
          >
            <Image source={{ uri: image.url }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    );
  
    const navigateToZoomedImage = (imageUrl) => {
      navigation.navigate("ZoomedImage", { imageUrl });
    };
  
    const renderImages = () => {
      if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }
  
      if (!images.length) {
        return (
          <View style={styles.loadingContainer}>
            <Text>There are no media files.</Text>
          </View>
        );
      }
  
      const imagesInRows = [];
      const rowSize = 3;
  
      for (let i = 0; i < images.length; i += rowSize) {
        imagesInRows.push(images.slice(i, i + rowSize));
      }
  
      return (
        <FlatList
          data={imagesInRows}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImageRow}
        />
      );
    };
  
    return <View style={styles.container}>{renderImages()}</View>;
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textNoti: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    imageRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 0,
    },
    imageContainer: {
      width: "33.33%",
      margin: 3,
    },
    image: {
      width: "100%",
      height: 135,
    },
  });
  
  export default ManageMedia;
  