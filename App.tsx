import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
  PermissionStatus,
} from "expo-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";

export default function App() {
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [mediaLibraryPermissions, requestMediaLibraryPermissions] =
    useMediaLibraryPermissions();

  const [state, setState] = useState<{
    loading: boolean;
    image: string | null;
    toast: {
      message: string;
      isVisible: boolean;
    };
    textRecognition: [] | null;
  }>({
    loading: false,
    image: null,
    textRecognition: null,
    toast: {
      message: "",
      isVisible: false,
    },
  });

  const verifyCameraPermissions = async () => {
    if (cameraPermissions.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestCameraPermissions();
      return permissionResponse.granted;
    }

    if (cameraPermissions.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient permissions",
        "You need to grant camera permissions"
      );
      return false;
    }

    return true;
  };

  const verifyMediaLibraryPermissions = async () => {
    if (cameraPermissions.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestCameraPermissions();
      return permissionResponse.granted;
    }

    if (cameraPermissions.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient permissions",
        "You need to grant camera permissions"
      );
      return false;
    }

    return true;
  };

  async function onPress(type: "capture" | "library") {
    setState({ ...state, loading: true });

    let image;
    if (type === "capture") {
      const hasCameraPermission = await verifyCameraPermissions();
      const hasMediaPermission = await verifyMediaLibraryPermissions();
      if (!hasCameraPermission || !hasMediaPermission) {
        return;
      }
      image = await launchCameraAsync();
      console.log(image);
    } else {
      image = await launchImageLibraryAsync();
    }

    console.log(image);
    onImageSelect(image);
  }

  async function onImageSelect(media: { assets: [{ uri: string }] }) {
    if (!media) {
      setState({ ...state, loading: false });
      return;
    }
    if (!!media && media.assets) {
      const file = media.assets[0].uri;
      // const textRecognition = await MlkitOcr.detectFromUri(file);
      // console.log(textRecognition);
      const INFLIGHT_IT = "Inflight IT";
      //if match toast will appear
      // const matchText = textRecognition.findIndex((item: { text: string }) =>
      // item.text.match(INFLIGHT_IT)
      // );
      setState({
        ...state,
        // textRecognition,
        image: file,
        // toast: {
        //   message: matchText > -1 ? "Ohhh i love this company!!" : "",
        //   isVisible: matchText > -1,
        // },
        loading: false,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>RN OCR SAMPLE</Text>
        <View>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => onPress("capture")}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          {/* <View>
            <TouchableOpacity
              style={[styles.button, styles.shadow]}
              onPress={() => onPress("library")}
            >
              <Text>Pick a Photo</Text>
            </TouchableOpacity>
          </View> */}
          <View>
            <View>
              {/*  LOADING */}
              {state.image && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: state.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
              {/* {!!state.textRecognition &&
                state.textRecognition.map(
                  (item: { text: string }, i: number) => (
                    <Text key={i}>{item.text}</Text>
                  )
                )} */}
            </View>
          </View>
        </View>
        {/* {state.toast.isVisible &&
          ToastAndroid.showWithGravityAndOffset(
            state.toast.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  content: {},
  title: { textAlign: "center" },
  image: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginTop: 30,
    width: "100%",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    borderWidth: 1,
    marginTop: 40,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    textAlign: "center",
  },
});
