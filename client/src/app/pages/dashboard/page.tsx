'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Components
import HeaderFunc from '@/app/components/Header/header';
import Sidebar from '@/app/components/sidebar/sidebar';

// Hooks
import useAuth from '@/hooks/useAuth';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DashBoard = () => {
    const authToken = useAuth();

    if (!authToken) {
        return null;
    }

    // Bar Chart data and options
    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [50, 60, 70, 80, 90, 100, 110],
                backgroundColor: ['#00255B', '#3F8CFF'],
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
            <HeaderFunc />

            <div className="row">
                <div className="col-lg-2">
                    <Sidebar />
                </div>
                <div className="col-lg-9">
                    <h2>Welcome Islahuddin</h2>
                    <p>Explore on-chain funds deployed by the community, or create your own.</p>

                    <div className="row">
                        <div className="col-lg-6" style={{ width: '50%', margin: '0 auto', marginBottom: '2rem' }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                        <div className="col-lg-6">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div style={{ width: '50%', margin: '0 auto' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
