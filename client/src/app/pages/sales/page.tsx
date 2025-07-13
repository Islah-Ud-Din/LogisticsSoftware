'use client';
import React, { useState, useRef } from 'react';
import { Table, Button, Input, Popconfirm, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HeaderFunc from '@/app/components/Header/header';
import Sidebar from '@/app/components/sidebar/sidebar';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    description: string;
    amount: number;
    status: string;
    tags: string[];
}

const Sale: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // Store selected row keys
    const [searchText, setSearchText] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddSale = () => {
        fileInputRef.current?.click();
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

            const parsedData: DataType[] = jsonData.map((item, index) => ({
                key: index,
                id: item.id || `ID-${Date.now()}-${index}`,
                name: item.name || '',
                description: item.description || '',
                amount: Number(item.amount) || 0,
                status: item.status || 'Pending',
                tags: item.tags ? item.tags.split(',') : ['Pending'], // Handling multiple tags
            }));

            setDataSource(parsedData);
        };

        reader.readAsArrayBuffer(file);
    };

    // Handle delete for selected rows
    const handleDeleteSelected = () => {
        const newData = dataSource.filter((item) => !selectedRowKeys.includes(item.key));
        setDataSource(newData);
        setSelectedRowKeys([]); // Reset selected row keys after deletion
    };

    // Columns with sorting and tags
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value: string, record: DataType) => record.id.includes(value),
            filterSearch: true,
            filterMode: 'menu',
            sorter: (a: DataType, b: DataType) => a.id.localeCompare(b.id), // Sorting by ID
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value: string, record: DataType) => record.name.toLowerCase().includes(value.toLowerCase()),
            filterSearch: true,
            filterMode: 'menu',
            sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name), // Sorting by Name
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: (a: DataType, b: DataType) => a.amount - b.amount, // Sorting by Amount
            render: (text: number) => <span>{text}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            render: (tags: string[]) => (
                <>
                    {tags.map((tag, index) => (
                        <Tag color="blue" key={index}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ),
        },
    ];

    // Search handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    return (
        <>
            <HeaderFunc />
            <div className="row">
                <div className="col-lg-2">
                    <Sidebar />
                </div>
                <div className="col-lg-10">
                    <div className="sales-header">
                        <h2>Sale Content</h2>
                        <p>Sale Content</p>
                    </div>

                    <div className="sales-actions">
                        <button className="btn btn-primary" onClick={handleAddSale}>
                            Add Sale
                        </button>

                        <Button className="btn btn-danger" onClick={handleDeleteSelected} disabled={selectedRowKeys.length === 0}>
                            Delete Selected Rows
                        </Button>

                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Search Bar */}
                    <Input
                        placeholder="Search by ID or Name"
                        value={searchText}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                        style={{ marginBottom: 16, width: '300px' }}
                    />

                    {/* Ant Design Table with filters */}
                    <Table<DataType>
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 10 }}
                        rowKey="key"
                        rowSelection={rowSelection} // Enable row selection
                        defaultSortOrder="ascend"
                    />

                    {/* Button to delete selected rows */}
                </div>
            </div>
        </>
    );
};

export default Sale;

