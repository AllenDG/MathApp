import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import TurnBasedScreen from './TurnBasedScreen';
import Button from "../components/button/Button";

export default function TurnBasedStartScreen({ navigation }) {
  return (
    <ImageBackground
    resizeMode="cover"
    source={require("../../assets/monsterMath.png")}
    style={styles.container}
  >
      <Text style={styles.title}></Text>
      
      <Button
            onPress={() => navigation.push("TurnBased")}
            
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
    marginTop: 200,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
