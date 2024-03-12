
import { Formik } from 'formik';
import { db, auth } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {
    View, 
    Text,
    TextInput,
    Pressable, 
    Modal,
    StyleSheet,
    Alert,
} from 'react-native';
import { 
    changeInfoInitialValue,
    changeInfoSchema
} from '../validations/ChangeInfoValidation';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChangeInfoModal({ visible, onClose }) {

    const handleChangeInfo = async (values) => {
      const { firstName, lastName } = values;
      try {
        if ( auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDocRef, {
            firstName: firstName,
            lastName: lastName,
          });
          Alert.alert("You have successfully changed your name");
          onClose();
        }
      } catch (error) {
        Alert.alert('Error updating user information:', error);
      }
    };
  
    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={ChangeInfoModalStyles.centeredView}>
          <View style={ChangeInfoModalStyles.modalView}>
            <Pressable style={ChangeInfoModalStyles.exit} onPress={onClose}>
              <Ionicons name="close-circle-outline" size={25} />
            </Pressable>
            <Text style={ChangeInfoModalStyles.modalText}>Change Personal Information</Text>
            <Formik
              initialValues={changeInfoInitialValue}
              validationSchema={changeInfoSchema}
              onSubmit={handleChangeInfo}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  <TextInput
                    style={ChangeInfoModalStyles.modalInput}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    placeholder="Change your first name"
                  />
                  {errors.firstName && touched.firstName ? (
                    <Text style={ChangeInfoModalStyles.errorText}>{errors.firstName}</Text>
                  ) : null}
                  <TextInput
                    style={ChangeInfoModalStyles.modalInput}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    placeholder="Change your last name"
                  />
                  {errors.lastName && touched.lastName ? (
                    <Text style={ChangeInfoModalStyles.errorText}>{errors.lastName}</Text>
                  ) : null}
                  <Pressable style={ChangeInfoModalStyles.modalButton} onPress={handleSubmit}>
                    <Text style={ChangeInfoModalStyles.textStyle}>Submit</Text>
                  </Pressable>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    );
}

const ChangeInfoModalStyles = StyleSheet.create({
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