import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function App() {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    async function prepareRecording() {
      const { status } = await Audio.requestPermissionsAsync(); //오디오 권한 요청
      if (status !== "granted") {
        alert("Permission to access audio is required.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording(); //새로운 녹음 인스턴스 생성
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY //높은 품질로 녹음 설정
      );
      setRecording(recording);
    }
    prepareRecording();
  }, []);

  async function startRecording() {
    try {
      await recording.startAsync(); //녹음시작
      setIsRecording(true);
    } catch (error) {
      console.log("Error starting recording", error);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync(); //녹음 중지 후 저장
      setIsRecording(false);
      const uri = recording.getURI(); //저장된 파일의 URI
      console.log("Recording saved to:", uri);
      const { sound } = await Audio.Sound.createAsync({ uri }); //녹음된 파일의 URI를 사용하여 sound 객체 생성
      setSound(sound);
    } catch (error) {
      console.log("Error stopping recording", error);
    }
  }

  async function playSound() {
    try {
      await sound.playAsync(); //녹음된 파일 재생
    } catch (error) {
      console.log("Error playing sound", error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.button}
      >
        <Text>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={playSound}
        disabled={!sound}
        style={[styles.button, { marginTop: 5 }]}
      >
        <Text>Play Sound</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: "#61dafb",
    padding: 8,
  },
});
