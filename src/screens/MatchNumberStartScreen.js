import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Button from "../components/button/Button";

export default function MatchNumberStartScreen({ navigation }) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../assets/mathyMatching.png")}
      style={styles.container}
    >
      <Text style={styles.title}></Text>
      <Button
            onPress={() => navigation.push("MatchNumber")}
            title="Start Game"
          />
        </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});