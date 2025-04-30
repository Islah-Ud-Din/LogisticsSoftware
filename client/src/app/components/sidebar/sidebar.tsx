'use client';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Sider } = Layout;

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ height: '100vh', background: '#ffff' }}
        >
            {/* Navigation Menu */}
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={['1']}
                onClick={({ key }) => router.push(key)}
                items={[
                    { key: '/pages/dashboard', icon: <UserOutlined />, label: 'Home' },
                    { key: '/pages/sales', icon: <VideoCameraOutlined />, label: 'Sales' },
                    { key: '/pages/purchase', icon: <UploadOutlined />, label: 'Purchase' },
                    { key: '/pages/contact', icon: <UploadOutlined />, label: 'Contact Us' },
                ]}
            />

            {/* Toggle Button Positioned at the Bottom */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64 }}
                />
            </div>
        </Sider>
    );
}
