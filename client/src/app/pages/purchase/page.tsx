'use client';
import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Layout, theme } from 'antd';

// Component
import HeaderFunc from '@/app/components/Header/header';
import Sidebar from '@/app/components/sidebar/sidebar';
// Hooks
import useAuth from '@/hooks/useAuth';

import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const { Content } = Layout;

const Purchase: React.FC = () => {
    const authToken = useAuth();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    if (!authToken) {
        return null;
    }



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

    const pieData = {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [
            {
                label: 'Sales Distribution',
                data: [300, 200, 100, 150], // Example data values
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Sales Distribution (Pie Chart)',
            },
        },
    };

    return (
        <>
            <HeaderFunc />
            <Layout>
                <Sidebar />
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div className="row">
                            <div className="col-lg-6">
                                <Bar data={barData} options={barOptions} />
                            </div>
                            <div className="col-lg-6">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-3">
                                <Pie data={pieData} options={pieOptions} />
                            </div>

                            <div className="col-lg-3">
                                <Pie data={pieData} options={pieOptions} />
                            </div>

                            <div className="col-lg-6">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Purchase;
