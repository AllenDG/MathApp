import { Formik } from 'formik';
import { auth } from '../../../firebase';
import { 
    View, 
    Text, 
    TextInput,
    Pressable, 
    Modal,
    Alert, 
    StyleSheet,
} from 'react-native';
import {
    updatePassword, 
    EmailAuthProvider, 
    reauthenticateWithCredential 
} from 'firebase/auth';
import { 
    changePasswordInitialValue,
    changePasswordSchema
 } from '../validations/ChangePasswordValidation';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChangePasswordModal({ visible, onClose }) {
  
  const handleChangePassword = async (values) => {
    const { oldPassword, password } = values;
    try {
      if (auth.currentUser) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
  
        await updatePassword(auth.currentUser, password);
  
        Alert.alert("You have successfully changed your password");
        onClose();
      }
      
    } catch (error) {
      Alert.alert('Error updating password:', error.message);
    }
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={ChangePasswordModalStyles.centeredView}>
          <View style={ChangePasswordModalStyles.modalView}>
            <Pressable
              style={ChangePasswordModalStyles.exit}
              onPress={onClose}>
                <Ionicons name="close-circle-outline" size={25}/>
            </Pressable>
            <Text style={ChangePasswordModalStyles.modalText}>Change your Password</Text>
            <Formik
              initialValues={changePasswordInitialValue}
              validationSchema={changePasswordSchema}
              onSubmit={handleChangePassword}
            >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) =>  (
              <>
                <TextInput
                  style={ChangePasswordModalStyles.modalInput}
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  value={values.oldPassword}
                  placeholder='Enter your old password'
                  secureTextEntry={true}
                />

                {errors.oldPassword && touched.oldPassword ? (
                <Text style={ChangePasswordModalStyles.errorText}>{errors.oldPassword}</Text>
                ) : null}
                <TextInput
                  style={ChangePasswordModalStyles.modalInput}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder='Enter your new password'
                  secureTextEntry={true}
                />
                {errors.password && touched.password ? (
                <Text style={ChangePasswordModalStyles.errorText}>{errors.password}</Text>
                ) : null}
                
                <TextInput
                  style={ChangePasswordModalStyles.modalInput}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  placeholder='Confirm your new password'
                  secureTextEntry={true}
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                <Text style={ChangePasswordModalStyles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
                <Pressable
                  style={ChangePasswordModalStyles.modalButton}
                  onPress={handleSubmit}>
                  <Text style={ChangePasswordModalStyles.textStyle}>Submit</Text>
                </Pressable>
              </>
            )}
            </Formik>
          </View>
        </View>
    </Modal>
  );
}

const ChangePasswordModalStyles = StyleSheet.create({
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
    errorText: {
      color: "#FF3D3D"
    },
    modalInput: {
      width: 300,
      marginTop: 8,
      padding: 12,
      backgroundColor: '#fafafa',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 8
    },
    modalButton: {
      width: 300,
      borderRadius: 12,
      paddingVertical: 15,
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
      fontWeight: 'bold'
    },
    exit: {
      alignSelf: 'flex-end'
    }
  });
