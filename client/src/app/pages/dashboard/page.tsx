'use client';

import React, { useEffect, useState } from 'react';

// Lib
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    ArcElement,
    Legend,
} from 'chart.js';

// Components
import HeaderFunc from '@/app/components/Header/header';
import Sidebar from '@/app/components/sidebar/sidebar';

// Hooks
import useAuth from '@/hooks/useAuth';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

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
                backgroundColor: ['#00255B', '#3F8CFF', '#B1E3FF', '#9CA1A2'],
            },
        ],
    };

    // Bar Chart options
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },

            title: {
                display: true,
                text: 'Monthly Sales Data (Bar Chart)',
                position: 'bottom',
            },
        },

        elements: {
            bar: {
                borderRadius: 10,
            },
        },
    };

    // Pie Chart data and options
    const pieData = {
        labels: ['Opzelura', 'Abilify', 'Chlorthalidone', 'Zofran'],
        datasets: [
            {
                label: 'Sales',
                data: [300, 50, 80, 60],
                backgroundColor: ['#3F8CFF', '#B1E3FF', '#979797', '#00255B'],
                hoverOffset: 10,
                borderWidth: 2,
                borderRadius: 5,
                hoverBackgroundColor: ['#3F8CFF', '#B1E3FF', '#979797', '#00255B'],
            },
        ],
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

    // Card Data
    const cards = [
        {
            title: 'Total Money',
            amount: 'Rs 70,00,000',
            change: '+11.01%',
            color: 'text-green-500',
        },
        {
            title: 'Investments',
            amount: 'Rs 35,00,000',
            change: '+8.40%',
            color: 'text-blue-500',
        },
        {
            title: 'Expenses',
            amount: 'Rs 20,00,000',
            change: '+4.25%',
            color: 'text-red-500',
        },
        {
            title: 'Savings',
            amount: 'Rs 15,00,000',
            change: '+6.88%',
            color: 'text-yellow-500',
        },
    ];
    return (
        <div className="bpo-dashboard">
            <HeaderFunc />

            <div className="row bpo-content">
                <div className="bpo-sidebar col-lg-2">
                    <Sidebar />
                </div>
                <div className="bpo-content-area col-lg-10">
                    {/* DashBoard Header */}
                    <div className="dashboard-head">
                        <h2>Welcome Islahuddin</h2>
                        <p>Explore on-chain funds deployed by the community, or create your own.</p>
                    </div>
                    {/* DashBoard Header */}

                    {/* DashBoard Content */}
                    <div className="dashboard-content">
                        <div className="row">
                            <div className="col-lg-8">
                                {/* Card */}
                                <div className="card-section">
                                    <div className="row">
                                        {cards.map((card, index) => (
                                            <div key={index} className="card card-item">
                                                <h3 className="card-head">{card.title}</h3>
                                                <h2 className="card-amount">{card.amount}</h2>
                                                <p className={`text-sm font-semibold ${card.color}`}>{card.change}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Card */}

                                {/* Business Performance Overview */}
                                <div className="bpo-section">
                                    <div className="row">
                                        <div className="bpo-left col-lg-6" style={{ margin: '0 auto', marginBottom: '2rem' }}>
                                            <h4 className="bpo-heading">Total Import</h4>
                                            <p>Explore on-chain funds deployed by the community, or create your own.</p>
                                            <Bar data={barData} options={barOptions} />
                                        </div>

                                        <div className="bpo-right col-lg-6" style={{ marginBottom: '2rem' }}>
                                            <h4 className="bpo-heading">Total Sale</h4>
                                            <p>Explore on-chain funds deployed by the community, or create your own.</p>
                                            <Pie
                                                style={{ margin: '0 auto' }}
                                                data={pieData}
                                                width={300}
                                                height={300}
                                                options={{
                                                    responsive: false,
                                                    maintainAspectRatio: false,
                                                }}
                                            />
                                        </div>
                                        <Line data={lineData} options={lineOptions} />
                                    </div>
                                </div>
                                {/* Business Performance Overview */}
                            </div>
                            <div className="col-lg-4">
                                <div style={{ width: '50%', margin: '0 auto' }}>
                                    <h2> Available Stocks</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* DashBoard Content */}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
