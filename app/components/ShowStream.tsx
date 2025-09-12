import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    let interval: number | null = null;

    if (permission?.granted && cameraRef.current) {
      interval = setInterval(async () => {
        if (cameraRef.current) {
          try {
            const photo = await cameraRef.current.takePictureAsync({
              base64: true,
              skipProcessing: true,
            });
            setImageBase64(photo.base64 ?? null);
            // 這裡可以呼叫 react-native-image-colors 進行分析
          } catch (e) {
            console.warn("Failed to take picture:", e);
          }
        }
      }, 1000); // 每 0.1 秒
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [permission?.granted]);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  //   function toggleCameraFacing() {
  //     setFacing(current => (current === 'back' ? 'front' : 'back'));
  //   }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}
        {/* 這裡可以顯示 imageBase64 或分析結果 */}
        {/* <Text
          selectable
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          {imageBase64 ? String(imageBase64) : "No image yet."}
        </Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
