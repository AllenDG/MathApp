import { useState } from "react";
import { auth, db } from "../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Formik } from "formik";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import {
  signUpInitialValue,
  signUpSchema,
} from "../components/validations/RegisterValidation";
import { Picker } from "@react-native-community/picker";
import { LinearGradient } from "expo-linear-gradient";
import DatePicker from "@react-native-community/datetimepicker";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import BackButton from "../components/button/BackButton";

export default function RegisterScreen({ navigation }) {
  const MIN_AGE = 3;
  const MAX_AGE = 6;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values) => {
    if (loading) return;
    const {
      firstName,
      lastName,
      sex,
      email,
      contactNumber,
      guardian,
      password,
    } = values;
    setLoading(true);
    try {
      let currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();

      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < MIN_AGE || age > MAX_AGE) {
        return Alert.alert(
          `You must be between ${MIN_AGE} and ${MAX_AGE} years old to register.`
        );
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        sex: sex,
        age: age,
        birthDate: birthDate,
        email: email,
        contactNumber: contactNumber,
        guardian: guardian,
      });

      await sendEmailVerification(user);
      Alert.alert("Check your email for verification!");
      navigation.replace("Login");
    } catch (error) {
      let errorMessage = "An error occurred during sign-up.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email address is already in use.";
      } else if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/weak-password"
      ) {
        errorMessage = "Invalid email or weak password.";
      }

      Alert.alert("Sign-Up Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showDatepicker = () => {
    if (!showDatePicker) {
      setShowDatePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  return (
    <SafeAreaView style={RegisterStyles.container}>
      <ScrollView>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/secondary-background.png")}
          style={RegisterStyles.imageBackground}
        >
          <View style={RegisterStyles.header}> 
            <BackButton navigation={navigation}/>
            <Text style={RegisterStyles.title}>Create an account</Text>
          </View>
          <Formik
            initialValues={signUpInitialValue}
            validationSchema={signUpSchema}
            onSubmit={handleSignUp}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={RegisterStyles.label}>
                  <Text>First Name</Text>
                  {errors.firstName && touched.firstName ? (
                    <Text style={RegisterStyles.errorText}>
                      *{errors.firstName}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                  placeholder="John"
                />
                <View style={RegisterStyles.label}>
                  <Text>Last Name</Text>
                  {errors.lastName && touched.lastName ? (
                    <Text style={RegisterStyles.errorText}>
                      *{errors.lastName}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                  placeholder="Doe"
                />
                <View style={RegisterStyles.label}>
                  <Text>Sex</Text>
                  {errors.sex && touched.sex ? (
                    <Text style={RegisterStyles.errorText}>*{errors.sex}</Text>
                  ) : null}
                </View>
                <LinearGradient
                  colors={["#979DB2", "#676C7D"]}
                  style={RegisterStyles.select}
                >
                  <Picker
                    selectedValue={values.sex}
                    onValueChange={handleChange("sex")}
                    style={{ color: "#fff" }}
                  >
                    <Picker.Item label="Select your sex" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </LinearGradient>
                <View style={RegisterStyles.label}>
                  <Text>Birth Date</Text>
                </View>
                <TouchableOpacity onPress={showDatepicker}>
                  <LinearGradient
                    colors={["#979DB2", "#676C7D"]}
                    style={RegisterStyles.input}
                  >
                    <Text style={{ color: "#fff" }}>
                      {birthDate.toDateString()}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                {showDatePicker && (
                  <DatePicker
                    testID="datePicker"
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <View style={RegisterStyles.label}>
                  <Text>Email</Text>
                  {errors.email && touched.email ? (
                    <Text style={RegisterStyles.errorText}>
                      *{errors.email}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder="Enter your email"
                />
                <View style={RegisterStyles.label}>
                  <Text>Contact Number</Text>
                  {errors.contactNumber && touched.contactNumber ? (
                    <Text style={RegisterStyles.errorText}>
                      *{errors.contactNumber}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("contactNumber")}
                  onBlur={handleBlur("contactNumber")}
                  value={values.contactNumber}
                  placeholder="Enter your contact number"
                />
                <View style={RegisterStyles.label}>
                  <Text>Guardian</Text>
                  {errors.guardian && touched.guardian ? (
                    <Text style={RegisterStyles.errorText}>
                      *{errors.guardian}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("guardian")}
                  onBlur={handleBlur("guardian")}
                  value={values.guardian}
                  placeholder="Enter your guardian"
                />
                <View style={RegisterStyles.label}>
                  <Text>Password</Text>
                  {errors.password && touched.password ? (
                    <Text style={RegisterStyles.errorText}>
                      {errors.password}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Password must be atleast 8 characters"
                  secureTextEntry={true}
                />
                <View style={RegisterStyles.label}>
                  <Text>Confirm Password</Text>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <Text style={RegisterStyles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
                <Input
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder="Password must match"
                  secureTextEntry={true}
                />
                <Button
                  onPress={handleSubmit}
                  disabled={loading}
                  loading={loading}
                  title="Sign Up"
                />
              </View>
            )}
          </Formik>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const RegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    padding: 20,
  },
  containerCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0078EB",
    textShadowColor: "#5BD1FF",
    textShadowOffset: { width: -2, height: 2 }, 
    textShadowRadius: 2, 
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#707070",
  },
  label: {
    marginTop: 12,
    flexDirection: "row",
    gap: 6,
  },
  input: {
    backgroundColor: "hidden",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
    padding: 12,
  },
  select: {
    backgroundColor: "hidden",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
  },
  loginText: {
    color: "#09814A",
    marginLeft: 3,
  },
  errorText: {
    color: "#FF3D3D",
  },
});
