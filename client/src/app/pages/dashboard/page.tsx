'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const DashBoard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push('/');
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    // Bar Chart data and options
    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [50, 60, 70, 80, 90, 100, 110],
                backgroundColor:[ '#95A4FC', '#BAEDBD', '#1C1C1C' ,'#B1E3FF'],
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Sales Data (Bar Chart)',
            },
        },
    };

    // Line Chart data and options
    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Revenue',
                data: [80, 20, 90, 10, 45, 105, 110],
                borderColor: 'rgba(53, 162, 235, 1)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                borderWidth: 2,
                tension: 0.4, // Smooth lines
                fill: true,
            },

            {
                label: 'Product A Revenue',
                data: [40, 30, 50, 60, 80, 70, 80],
                borderColor: 'rgba(255, 99, 132, 1)', // Red color for Product A
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1', // Matches the secondary y-axis
                fill: true,
            },
        ],

    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Revenue Data (Line Chart)',
            },
        },
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard!</p>
            <div style={{ width: '50%', margin: '0 auto', marginBottom: '2rem' }}>
                <Bar data={barData} options={barOptions} />
            </div>
            <div style={{ width: '50%', margin: '0 auto' }}>
                <Line data={lineData} options={lineOptions} />
            </div>
        </div>
    );
};

export default DashBoard;
