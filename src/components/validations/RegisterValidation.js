import * as Yup from 'yup';

export const signUpInitialValue = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  
export const signUpSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, 'Too Short')
      .max(50, 'Too Long')
      .matches(/^[A-Za-z]+$/, 'It can only contain letters')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .matches(/^[A-Za-z]+$/, 'It can only contain letters')
      .required('Required'),
    sex: Yup.string()
      .required('Required'),     
    email: Yup.string().email('Invalid email').required('Required'),
    contactNumber: Yup.string()
      .required('Required'),
    guardian: Yup.string()
      .required('Required'),  
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password is too long')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
});