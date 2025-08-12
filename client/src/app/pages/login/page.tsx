'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';

// Context
import { useUser } from '@/context/UserContext';

// Custom Hook
import { useApi } from '../../../hooks/useApi';

// Assets
import MainMockup from '../../assets/images/svg/login.svg';
import Logo from '../../assets/images/svg/logo.svg';

const { Title, Link } = Typography;

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const { setAuthToken } = useUser();
    const { postRequest } = useApi();

    const handleLogin = async (values: LoginFormValues) => {
        try {
            const response = await postRequest<{ accessToken: string }>('/api/login', values);

            if (response.accessToken) {
                setAuthToken(response.accessToken);
                localStorage.setItem('authToken', response.accessToken);
                router.push('/pages/dashboard');
            }
        } catch (err: any) {
            if (err?.response?.status === 404 || err?.response?.data?.message === 'User not found') {
                message.error('Account does not exist. Please create an account.');
            } else if (err?.response?.data?.message) {
                message.error(err.response.data.message);
            } else {
                message.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="signup-page">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 signup-left mb-5 mb-lg-0" style={{ paddingRight: '40px' }}>
                        <div className="sl-logo d-flex align-items-center mb-3">
                            <Image className="img-fluid" src={Logo} alt="Logo" width={40} height={40} />
                            <h3 style={{ marginLeft: '10px' }}>TravelSol</h3>
                        </div>

                        <h2 className="mb-5">Your place to work, Plan, Create, Control</h2>
                        <Image className="img-fluid" src={MainMockup} alt="Main" width={500} height={500} />
                    </div>

                    <div className="col-lg-6 login-content" style={{ paddingLeft: '40px', maxWidth: '500px', width: '100%' }}>
                        <Title level={4} style={{ textAlign: 'center', marginBottom: '32px' }}>
                            Login to Your Account
                        </Title>

                        <Form layout="vertical" onFinish={handleLogin}>
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Email is required' },
                                    { type: 'email', message: 'Invalid email format' },
                                ]}
                            >
                                <Input placeholder="youremail@gmail.com" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: 'Password is required' },
                                    { min: 6, message: 'Password must be at least 6 characters' },
                                ]}
                            >
                                <Input.Password placeholder="Enter your password" size="large" />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button type="primary" htmlType="submit" size="large">
                                        Login
                                    </Button>
                                </div>
                            </Form.Item>

                            <Form.Item style={{ textAlign: 'center' }}>
                                <Link href="/pages/SignUp">Don’t have an account? Sign up here.</Link>
                            </Form.Item>
                        </Form>

                        <p style={{ marginTop: '20px', textAlign: 'center' }}>
                            <strong>Login</strong> with Others
                        </p>

                        <div style={{ marginTop: 16, maxWidth: 400, marginInline: 'auto' }}>
                            <Button block style={{ marginBottom: 8 }} size="large" onClick={() => console.log('Google Login')}>
                                Login with Google
                            </Button>
                            <Button block size="large" onClick={() => console.log('Facebook Login')}>
                                Login with Facebook
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
