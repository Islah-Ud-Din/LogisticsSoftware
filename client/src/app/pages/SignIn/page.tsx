'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button, TextField, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/compat/router';

import login from '../../assets/images/svg/login.svg';

const SignInPage = () => {
    // State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    // Router
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3670/api/register', { email, password });
            setOpenDialog(true);
            setError('');
            console.log(response.data);
        } catch {
            setError('Registration failed. Please try again.');
        }
    };

    const handleVerifyToken = async () => {
        try {
            const response = await axios.post('http://localhost:3670/api/verify-otp', { email, token: verificationToken });
            setIsVerified(true);
            setOpenDialog(false);
            setError('');
            console.log(response.data);

            // Redirect to the login page after successful OTP verification

            if (response.data.message) {
                router?.push('/pages/login');
            }
        } catch {
            setError('Verification failed. Please check your token.');
        }
    };

    return (
        <div className="signin-page">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 signin-left">
                        <Typography variant="h3" component="h1" gutterBottom>
                            Your place to work Plan. Create. Control.
                        </Typography>

                        <Image src={login} alt="Workplace Illustration" layout="responsive" />
                    </div>

                    <div className="col-lg-6 signin-right">
                        <div className="flex items-center justify-center min-h-screen">
                            <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
                                <CardContent>
                                    <Typography variant="h5" component="h2" className="text-center mb-6">
                                        Sign In to Woorkroom
                                    </Typography>
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <label style={{ fontWeight: 'bold', textAlign: 'start', display: 'block', marginBottom: 4 }}>
                                            Email Address
                                        </label>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />

                                        <div>
                                            <label style={{ fontWeight: 'bold', textAlign: 'start', display: 'block', marginBottom: 4 }}>
                                                Password{' '}
                                            </label>
                                            <TextField
                                                label="Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        </div>

                                        {error && (
                                            <Typography color="error" className="text-center">
                                                {error}
                                            </Typography>
                                        )}

                                        <Button type="submit" variant="contained" color="primary" fullWidth>
                                            {isVerified ? 'Sign In' : 'Register'}
                                        </Button>
                                    </form>

                                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                        <DialogTitle>Verify Your Email</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                label="Verification Token"
                                                value={verificationToken}
                                                onChange={(e) => setVerificationToken(e.target.value)}
                                                placeholder="Enter the verification token"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleVerifyToken} color="primary" variant="contained">
                                                Verify
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
