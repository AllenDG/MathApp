import { LinearGradient } from "expo-linear-gradient";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function Button({ onPress, title, disabled, loading, variant }) {
  const backgroundVariant = {
    primary: {
      colors: ["#3F9CFF", "#1E6BD8"],
      borderColor: "#5BD1FF",
    },
    secondary: {
      colors: ["#FD8D14", "#FF5500"],
      borderColor: "#FF8C00",
    },
  };

  const selectedVariant = backgroundVariant[variant] || backgroundVariant.primary;

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, { borderColor: selectedVariant.borderColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={selectedVariant.colors}
        style={styles.buttonGradient}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
