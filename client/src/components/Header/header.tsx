'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Input, Badge, Button } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';

// Public
import logo from '../../../public/images/svg/logo.svg';

const { Header } = Layout;

function BpoHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useUser();

    // Menu Items
    const menuItems = [
        { key: '1', label: 'Home', path: '/pages/dashboard' },
        { key: '2', label: 'Sales', path: '/pages/sales' },
        { key: '3', label: 'Purchase', path: '/pages/purchase' },
        { key: '4', label: 'Contact', path: '/pages/contact' },
    ];

    // Determine which key is active based on current pathname
    const selectedKey = menuItems.find(item => pathname.startsWith(item.path))?.key || '1';

    // Handle logout
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <Header className="bpo-header" style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
            {/* Left Section: Logo */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '24px' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
            </div>

            {/* Center Section: Navigation Menu */}
            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[selectedKey]}
                items={menuItems.map(({ key, label, path }) => ({
                    key,
                    label,
                    onClick: () => router.push(path),
                }))}
                style={{ flex: 1, minWidth: 0 }}
            />

            {/* Right Section: Search, Notification, Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                />
                <Badge count={5}>
                    <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Badge>
                <Button type="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </Header>
    );
}

export default BpoHeader;
