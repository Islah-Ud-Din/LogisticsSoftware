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
import { ArrowUpOutlined, ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons';

// Componentsc
import HeaderFunc from '@/components/Header/header';
import Sidebar from '@/components/sidebar/sidebar';

// Import GLOBAL VAL
import { useUser } from '@/context/UserContext';

// Hooks
import useAuth from '@/hooks/useAuth';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);
const stocks = [
    { name: 'Opzelura', current: 30, max: 100 },
    { name: 'Abilify', current: 60, max: 100 },
    { name: 'Chlorthalidone', current: 90, max: 100 },
    { name: 'Zofran', current: 40, max: 100 },
    { name: 'Gabapentin', current: 10, max: 100 },
    { name: 'Lisinopril', current: 85, max: 100 },
    { name: 'Atorvastatin', current: 75, max: 100 },
    { name: 'Metformin', current: 50, max: 100 },
    { name: 'Albuterol', current: 20, max: 100 },
    { name: 'Omeprazole', current: 95, max: 100 },
    { name: 'Levothyroxine', current: 45, max: 100 },
    { name: 'Amlodipine', current: 65, max: 100 },
    { name: 'Sertraline', current: 15, max: 100 },
    { name: 'Simvastatin', current: 80, max: 100 },
    { name: 'Losartan', current: 55, max: 100 },
];

const DashBoard = () => {
    // States
    const [showAll, setShowAll] = useState(false);
    const visibleStocks = showAll ? stocks : stocks.slice(0, 5);
    // const authToken = useAuth();

    const { authToken } = useUser();

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

    const getStockStatus = (percent) => {
        if (percent > 70) return 'bg-primary';
        if (percent >= 30) return 'bg-secondary';
        return 'bg-danger';
    };

    const getStockLabel = (percent) => {
        if (percent > 85)
            return (
                <>
                    High <ArrowUpOutlined />
                </>
            );
        if (percent >= 50)
            return (
                <>
                    Medium <ArrowRightOutlined />
                </>
            );
        return (
            <>
                Low <ArrowDownOutlined />
            </>
        );
    };

    const getTextColorClass = (percent) => {
        if (percent > 70) return 'text-primary';
        if (percent >= 30) return 'text-secondary';
        return 'text-danger';
    };

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
                            {/* Avaliable Stocks */}
                            <div className="col-lg-8">
                                {/* Card */}
                                <div className="card-section">
                                    <div className="row">
                                        {cards.map((card, index) => (
                                            <div key={index} className="col-lg-3 mb-3">
                                                <div className="card card-item">
                                                    <h3 className="card-head">{card.title}</h3>
                                                    <h2 className="card-amount">{card.amount}</h2>
                                                    <p className={`text-sm font-semibold mb-0 ${card.color}`}>{card.change}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Card */}

                                {/* Business Performance Overview */}
                                <div className="bpo-section">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="bpo-left">
                                                <h4 className="bpo-heading">Total Import</h4>
                                                <p>Explore on-chain funds deployed by the community, or create your own.</p>
                                                <Bar data={barData} options={barOptions} />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="bpo-right">
                                                <h4 className="bpo-heading">Total Sale</h4>
                                                <p>Explore on-chain funds deployed by the community, or create your own.</p>
                                                <Pie
                                                    data={pieData}
                                                    width={300}
                                                    height={250}
                                                    options={{
                                                        responsive: false,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'right',
                                                                labels: {
                                                                    usePointStyle: true,
                                                                    padding: 20,
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="line-chart">
                                        <h3>Business Performance Overview</h3>
                                        <Line data={lineData} options={lineOptions} />
                                    </div>
                                </div>
                                {/* Business Performance Overview */}
                            </div>
                            {/* Avaliable Stocks */}

                            {/* Avaliable Stocks */}
                            <div className="col-lg-4">
                                <div className="as-wrapper">
                                    <div className="asw-header">
                                        <h2 className="asw-text">Available Stocks</h2>
                                        <button className="btn btn-link  mt-2" onClick={() => setShowAll(!showAll)}>
                                            {showAll ? 'Show Less' : 'View All Stocks'}
                                        </button>
                                    </div>

                                    {visibleStocks.map((stock, idx) => {
                                        const percent = (stock.current / stock.max) * 100;
                                        return (
                                            <div key={idx} className="asw-bars mb-3">
                                                <h5>{stock.name}</h5>
                                                <div className="progress">
                                                    <div
                                                        className={`progress-bar ${getStockStatus(percent)}`}
                                                        role="progressbar"
                                                        style={{ width: `${percent}%` }}
                                                        aria-valuenow={stock.current}
                                                        aria-valuemin="0"
                                                        aria-valuemax={stock.max}
                                                    ></div>
                                                </div>
                                                <p className={`pb-text ${getTextColorClass(percent)}`}>{getStockLabel(percent)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Avaliable Stocks */}
                        </div>
                    </div>
                    {/* DashBoard Content */}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
