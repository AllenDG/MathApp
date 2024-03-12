import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import Button from "../components/button/Button";
import Input from "../components/input/Input";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openForgotPasswordModal = () => {
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        Alert.alert("You have successfully logged in");
        navigation.replace("Dashboard");
      } else {
        Alert.alert("Please verify your email before logging in.");
        await sendEmailVerification(user);
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many unsuccessful login attempts. Try again later.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage =
          "Invalid credentials. Please check your email and password.";
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={LoginStyles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/secondary-background.png")}
        style={LoginStyles.imageBackground}
      >
        <View style={LoginStyles.logoContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={LoginStyles.logo}
          />
        </View>

        <View>
          <Text style={LoginStyles.subTitle}>Login to Continue</Text>
          <Input
            value={email}
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            value={password}
            placeholder="Enter your password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={openForgotPasswordModal}>
            <Text style={LoginStyles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            title="Login"
          />
          <View style={LoginStyles.containerCenter}>
            <Text style={{ color: "gray" }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.push("Register")}>
              <Text style={LoginStyles.signUpText}>Sign up now!</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ForgotPasswordModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 180,
    alignSelf: "center",
    objectFit: "cover",
  },
  containerCenter: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#707070",
  },
  signUpText: {
    marginLeft: 3,
    color: "#707070",
    fontWeight: "bold",
  },
  forgotText: {
    color: "#707070",
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 3,
    marginTop: 8,
  },
});
