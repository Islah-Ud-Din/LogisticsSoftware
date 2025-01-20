'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography } from '@mui/material';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    };

    const formik = useFormik<LoginFormValues>({
        initialValues,
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            console.log(values);
            try {
                const response = await fetch('http://localhost:3670/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error('Invalid email or password');
                }

                const { token } = await response.json();
                localStorage.setItem('authToken', token);
                if (token) {
                    router.push('/pages/dashboard');
                }
            } catch (err) {
                console.error('Login error:', err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="login-page container-fluid">
            <div className="row">
                <div className="login-content">
                    <Typography variant="h4" sx={{ marginBottom: 3 }}>
                        Login
                    </Typography>
                    <Typography sx={{ marginBottom: 3 }}>How to get started? Lorem ipsum dolor sit amet.</Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Box>
                        <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Logging in...' : 'Login Now'}
                        </Button>
                    </form>
                    <p>
                        <span className="font-weight-bold">Login</span> with Others
                    </p>
                    <Box sx={{ marginTop: 2 }}>
                        <Button fullWidth sx={{ marginBottom: 1, maxWidth: '400px' }} onClick={() => console.log('Google Login')}>
                            Login with google
                        </Button>
                        <Button fullWidth  onClick={() => console.log('Facebook Login')}>
                            Login with Facebook
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default Login;
