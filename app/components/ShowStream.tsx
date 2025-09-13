import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Interface for captured frame data
interface CapturedFrame {
  id: number;
  base64: string | undefined;
  uri: string;
}

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedFrames, setCapturedFrames] = useState<CapturedFrame[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 當相機就緒時，啟動自動擷取
  const onCameraReady = () => {
    startCapture();
  };

  // 開始每0.5秒擷取畫面
  const startCapture = () => {
    if (captureIntervalRef.current) return; // 防止重複啟動

    captureIntervalRef.current = setInterval(async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true, // 啟用 Base64 編碼
            quality: 0.2, // 降低畫質以提升效能
          });
          console.log("Frame captured:", photo.uri);

          // 將新照片加入到 capturedFrames 陣列中
          setCapturedFrames((prevFrames) => {
            const newFrames = [
              { id: Date.now(), base64: photo.base64, uri: photo.uri },
              ...prevFrames,
            ];
            // 僅保留最新的20個畫面以避免記憶體問題
            return newFrames.slice(0, 20);
          });
        } catch (error) {
          console.error("Failed to take picture:", error);
        }
      }
    }, 500); // 500 毫秒 = 0.5 秒
  };

  // 停止自動擷取
  const stopCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
      console.log("Capture stopped.");
    }
  };

  // 清理間隔計時器
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  // 切換前後鏡頭
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // 檢查相機權限
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>正在載入權限狀態...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>我們需要您的相機權限來顯示畫面</Text>
        <Button onPress={requestPermission} title="授予權限" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: CapturedFrame }) => (
    <View style={styles.frameItem}>
      <Image source={{ uri: item.uri }} style={styles.frameImage} />
      <Text style={styles.frameText}>
        Base64 Data (僅顯示部分): {item.base64?.substring(0, 50) || "No base64 data"}...
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>0.5 秒相機畫面擷取</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={facing}
          onCameraReady={onCameraReady}
        />
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.flipText}>切換鏡頭</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startCapture}>
          <Text style={styles.buttonText}>開始擷取</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopCapture}
        >
          <Text style={styles.buttonText}>停止擷取</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={capturedFrames}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 3 / 4,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  flipButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 10,
  },
  flipText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    width: "90%",
    flex: 1,
  },
  frameItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  frameImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  frameText: {
    flex: 1,
    fontSize: 12,
    color: "#555",
  },
});
