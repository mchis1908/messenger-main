import React, { useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ZoomedImageScreen = ({ route }) => {
  const { imageUrl } = route.params;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Image Detail",
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

  return (
    <View style={styles.container}>
      <ImageZoom
        cropWidth={Dimensions.get("window").width}
        cropHeight={Dimensions.get("window").height}
        imageWidth={400}
        imageHeight={400}
      >
        <Image
          style={styles.image}
          source={{ uri: imageUrl }}
        />
      </ImageZoom>
    </View>
  );

  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ZoomedImageScreen;
