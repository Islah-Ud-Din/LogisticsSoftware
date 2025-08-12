import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';

const VerifyOtp = ({ visible, onClose, email }) => {
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            message.warning('Please enter the OTP');
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3670/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token: otp }), // include email
            });

            const data = await res.json();

            if (res.ok) {
                message.success('OTP verified successfully!');
                onClose();
                router.push('/pages/login');
            } else {
                message.error(data.message || 'Invalid OTP');
            }
        } catch (err) {
            message.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Verify OTP" open={visible} onCancel={onClose} footer={null}>
            <p>
                Please enter the OTP sent to <strong>{email}</strong>:
            </p>
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            <Button type="primary" block loading={loading} onClick={handleVerify} style={{ marginTop: '1rem' }}>
                Verify
            </Button>
        </Modal>
    );
};

export default VerifyOtp;
