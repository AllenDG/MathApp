import { TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BackButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backBtn}
    >
      <LinearGradient colors={["#3F9CFF", "#1E6BD8"]}>
        <Ionicons name="chevron-back-outline" size={30} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#5BD1FF",
  },
});
