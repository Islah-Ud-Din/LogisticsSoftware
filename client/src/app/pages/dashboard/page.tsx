'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DashBoard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard!</p>
        </div>
    );
};

export default DashBoard;
