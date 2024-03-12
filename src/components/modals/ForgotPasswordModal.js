import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase';
import {
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ForgotPasswordModal({ modalVisible, setModalVisible }) {
  const [forgotEmail, setForgotEmail] = useState('');

  const forgetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotEmail('');
      setModalVisible(false);
      Alert.alert('Password reset email sent');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('User not found. Please check your email address.');
      } else {
        Alert.alert(
          'Error sending password reset email. Please try again later.'
        );
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={ForgotPasswordModalStyles.centeredView}>
        <View style={ForgotPasswordModalStyles.modalView}>
          <Pressable
            style={ForgotPasswordModalStyles.exit}
            onPress={() => setModalVisible(!modalVisible)}>
            <Ionicons name="close-circle-outline" size={25} />
          </Pressable>
          <Text style={ForgotPasswordModalStyles.modalText}>
            Forgot Password
          </Text>
          <TextInput
            style={ForgotPasswordModalStyles.forgotEmail}
            value={forgotEmail}
            placeholder="Enter your email"
            onChangeText={(text) => setForgotEmail(text)}
          />

          <Pressable
            style={ForgotPasswordModalStyles.button}
            onPress={() => forgetPassword()}>
            <Text style={ForgotPasswordModalStyles.textStyle}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const ForgotPasswordModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  forgotEmail: {
    width: 300,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    width: 300,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    backgroundColor: '#191919',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 25,
    marginBottom: 15,
    textAlign: 'center',
  },
  exit: {
    alignSelf: 'flex-end',
  },
});
