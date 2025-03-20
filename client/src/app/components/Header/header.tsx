'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import Image from 'next/image';
import logo from '../../assets/images/svg/logo.svg';
import { useUser } from '@/context/UserContext';

const { Header } = Layout;

function HeaderFunc() {
    const router = useRouter();
    const {  logout } = useUser(); // Access the logout function from your context

    const menuItems = [
        { key: '1', label: 'Home', path: '/pages/dashboard' },
        { key: '2', label: 'Sales', path: '/pages/sales' },
        { key: '3', label: 'Purchase', path: '/pages/purchase' },
    ].map(({ key, label, path }) => ({
        key,
        label,
        onClick: () => router.push(path),
    }));

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
            <div style={{ marginRight: '20px' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} style={{ flex: 1, minWidth: 0 }} />
                <button className="btn btn-primary" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                    Logout
                </button>
        </Header>
    );
}

export default HeaderFunc;
