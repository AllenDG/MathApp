import * as Yup from 'yup';

export const changePasswordInitialValue = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
};

export const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password is too long')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
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
