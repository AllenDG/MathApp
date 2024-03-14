import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Button from "../components/button/Button";

export default function QuizGameStartScreen({ navigation }) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../assets/quizStart.png")}
      style={styles.container}
    >
      <Text style={styles.title}>/</Text>
      <Button onPress={() => navigation.push("QuizGame")} title="Start Game" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
    marginTop: 250,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
  
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    
  },
});
