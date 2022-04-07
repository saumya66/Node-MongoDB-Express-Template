import passwordSchema from '../utils/passwordStrengthValidation.js';

import yup from 'yup';

const schemas = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(3).max(128).required(),
    }),
  }),

  logoutSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  refreshTokenSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  registerSchema: yup.object({
    body: yup.object({
      email: yup.string().required(),
      password: yup.string()
      .required()
      .min(8, 'Must be 8 characters or more')
      .max(128, 'Must be 128 characters max')
      .test(
        'is-strong',
        'New password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character, no spaces',
        (value) => passwordSchema.validate(value)
      ),
    }),
  }),

  updatePasswordSchema: yup.object({
    body: yup.object({
      password: yup.string().min(3).max(128).required(),
      newPassword: yup
        .string()
        .required()
        .min(8, 'Must be 8 characters or more')
        .max(128, 'Must be 128 characters max')
        .notOneOf(
          [yup.ref('password'), null],
          'New password cannot be same as old'
        )

        .test(
          'is-strong',
          'New password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character, no spaces',
          (value) => passwordSchema.validate(value)
        ),

      newPasswordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    }),
  }),

  forgotPasswordSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
    }),
  }),

  resetPasswordSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
      newPassword: yup
        .string()
        .required()
        .min(8, 'Must be 8 characters or more')
        .max(128, 'Must be 128 characters max')

        .test(
          'is-strong',
          'New password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character, no spaces',
          (value) => passwordSchema.validate(value)
        ),
      newPasswordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    }),
  }),
};

export default schemas;
