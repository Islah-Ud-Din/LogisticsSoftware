import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          Alert.alert('Login Successful', `Welcome ${values.email}`);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, touched.email && errors.email && styles.inputError]}
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, touched.password && errors.password && styles.inputError]}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={handlePasswordToggle} style={styles.eyeIcon}>
                <Image
                  source={showPassword ? require('./assets/eye-on.png') : require('./assets/eye-off.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop
