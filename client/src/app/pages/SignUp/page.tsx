'use client';
import React, { useState } from 'react';

// Next
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Comp
import VerifyOtp from '../../../components/verify/VerifyOtp';

// Ant Design Lib
import { Button, Form, Input, Select, message } from 'antd';

// Axios
import axios from 'axios';

const { Option } = Select;

const SignUpPage = () => {
    // router
    const router = useRouter();

    // States
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle Form Submit
    const handleSubmit = async (values: any) => {
        setLoading(true);
        setUserEmail(values.email);
        try {
            const response = await axios.post('http://localhost:3670/api/register', {
                email: values.email,
                password: values.password,
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                country: values.country,
            });

            // Check for success message from the backend
            if (response.data.message) {
                message.success(response.data.message);
                setShowOtpModal(true);
                // router.push('/pages/login');
            }
        } catch (error) {
            console.error(error);
            message.error('Registration failed. Please try again.'); // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 signup-left">
                        <div className="sl-logo d-flex ">
                            <Image className="img-fluid" src="Images/svg/logo.svg" alt="Main" width={40} height={40} />
                            <h3>TravelSol</h3>
                        </div>

                        <h2 className="mb-5">Your place to work, Plan, Create, Control</h2>

                        <Image className="img-fluid" src="Images/svg/login.svg" alt="Main" width={500} height={500} />
                    </div>

                    <div className="col-lg-5 offset-lg-1  signup-right">
                        <div className="flex items-center justify-center min-h-screen">
                            <Form
                                name="signup"
                                onFinish={handleSubmit}
                                initialValues={{
                                    remember: true,
                                }}
                                layout="vertical"
                                style={{ maxWidth: 430, width: '100%' }}
                            >
                                <h3 className="text-center mb-6">Create a New Account</h3>

                                <Form.Item
                                    label="First Name"
                                    name="firstName"
                                    rules={[{ required: true, message: 'Please input your First Name!' }]}
                                >
                                    <Input placeholder="First Name" />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="lastName"
                                    rules={[{ required: true, message: 'Please input your Last Name!' }]}
                                >
                                    <Input placeholder="Last Name" />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input your email!' },
                                        { type: 'email', message: 'The input is not valid E-mail!' },
                                    ]}
                                >
                                    <Input placeholder="Enter your email" />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please input your password!' },
                                        {
                                            min: 6,
                                            message: 'Password must be at least 6 characters long!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm Password"
                                    name="confirm"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('The two passwords that you entered do not match!');
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="Confirm Password" />
                                </Form.Item>

                                <Form.Item
                                    label="Country"
                                    name="country"
                                    rules={[{ required: true, message: 'Please select your country!' }]}
                                >
                                    <Select placeholder="Select your country">
                                        <Option value="USA">USA</Option>
                                        <Option value="India">India</Option>
                                        <Option value="Pakistan">Pakistan</Option>
                                        <Option value="UK">UK</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={loading}>
                                        Register
                                    </Button>
                                </Form.Item>
                            </Form>

                            <VerifyOtp visible={showOtpModal} onClose={() => setShowOtpModal(false)} email={userEmail} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
