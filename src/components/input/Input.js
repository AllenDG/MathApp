import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const Input = ({ value, placeholder, onChangeText, onBlur, secureTextEntry }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <LinearGradient colors={["#979DB2", "#676C7D"]} style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry && !passwordVisible}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "hidden",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
    padding: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
  },
});

export default Input;
