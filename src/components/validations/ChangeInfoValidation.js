import * as Yup from 'yup';

export const changeInfoInitialValue = {
    firstName: '',
    lastName: '',
  };

export const changeInfoSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .matches(/^[A-Za-z]+$/, 'First name can only contain letters'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .matches(/^[A-Za-z]+$/, 'Last name can only contain letters'),
});