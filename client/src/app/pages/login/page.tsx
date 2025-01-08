'use client';

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import useSWR from 'swr';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
    email: string;
    password: string;
}

// Custom fetcher for SWR
const fetcher = async (key: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(key, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch session data');
    }

    return response.json();
};

const Login: React.FC = () => {
    const router = useRouter();

    // Check user session with SWR
    const { data, error, isLoading, mutate } = useSWR('/api/session', fetcher, { shouldRetryOnError: false });

    // Redirect if session is active
    useEffect(() => {
        if (data && !error) {
            router.push('/dashboard');
        }
    }, [data, error, router]);

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

            console.log(values)
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

                await mutate(); // Trigger SWR revalidation
            } catch (err) {
                console.error('Login error:', err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div>
            <h1>Login</h1>
            {isLoading && <p>Checking session...</p>}
            {error && <p style={{ color: 'red' }}>Session expired. Please login.</p>}

            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
                </div>
                <button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
