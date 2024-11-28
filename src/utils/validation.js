const yup = require('yup');

const noteSchema = yup.object().shape({
  title: yup.string()
    .required('Title is required')
    .max(50, 'Title must not exceed 50 characters'),
  text: yup.string()
    .required('Text is required')
    .max(300, 'Text must not exceed 300 characters'),
});

const userSchema = yup.object().shape({
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

module.exports = {
  noteSchema,
  userSchema,
};