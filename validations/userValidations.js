import yup from 'yup';

const schemas = {
  profileSchema: yup.object({
    access: yup.object({
      userId: yup.string().required(),
    }),
  }),
};

export default schemas;
