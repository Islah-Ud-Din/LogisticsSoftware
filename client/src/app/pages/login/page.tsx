'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Link } from '@mui/material';

// Context
import { useUser } from '@/context/UserContext';

// Custom Hook
import { useApi } from '../../../hooks/useApi';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const { setAuthToken } = useUser();
    const { postRequest } = useApi();

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
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await postRequest<{ accessToken: string }>('/api/login', values);

                if (response.accessToken) {
                    setAuthToken(response.accessToken);
                    localStorage.setItem('authToken', response.accessToken);
                    router.push('/pages/dashboard');
                }
            } catch (err: any) {
                if (err?.response?.status === 404 || err?.response?.data?.message === 'User not found') {
                    setStatus('Account does not exist. Please create an account.');
                } else if (err?.response?.data?.message) {
                    setStatus(err.response.data.message);
                } else {
                    setStatus('An unexpected error occurred. Please try again.');
                }
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
                        Login to your account
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>
                        <label style={{ fontWeight: 'bold', textAlign: 'start', display: 'block', marginBottom: 4 }}>Email</label>
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

                        <label style={{ fontWeight: 'bold', textAlign: 'start', display: 'block', marginBottom: 4 }}>Password</label>
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

                        {formik.status && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="error">
                                    {formik.status}
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Link href="/pages/SignUp" underline="hover" sx={{ display: 'block', mt: 1 }}>
                                Don’t have an account? Sign up here.
                            </Link>
                        </Box>
                    </form>

                    <p style={{ marginTop: '20px' }}>
                        <span className="font-weight-bold">Login</span> with Others
                    </p>

                    <Box sx={{ marginTop: 2 }}>
                        <Button fullWidth sx={{ marginBottom: 1, maxWidth: '400px' }} onClick={() => console.log('Google Login')}>
                            Login with Google
                        </Button>
                        <Button fullWidth onClick={() => console.log('Facebook Login')}>
                            Login with Facebook
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default Login;
