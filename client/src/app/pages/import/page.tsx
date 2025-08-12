'use client';
import React, { useState, useRef } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import * as XLSX from 'xlsx';
import classNames from 'classnames';

import HeaderFunc from '@/components/Header/header';
import Sidebar from '@/components/sidebar/sidebar';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    description: string;
    amount: number;
    status: string;
}

const Sale: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [selectedCell, setSelectedCell] = useState<{ rowIndex: number; columnKey: keyof DataType } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    };

    const handleAddSale = () => {
        fileInputRef.current?.click();
    };

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
            }));

            setDataSource(parsedData);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleAddDelete = () => {
        if (selectedCell) {
            const updated = [...dataSource];
            updated[selectedCell.rowIndex][selectedCell.columnKey] = '' as any;
            setDataSource(updated);
            setSelectedCell(null);
        }
    };

    const getCellClass = (rowIndex: number, columnKey: keyof DataType) => {
        return classNames({
            'selected-cell': selectedCell?.rowIndex === rowIndex && selectedCell?.columnKey === columnKey,
        });
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            onCell: (_, rowIndex) => ({
                onClick: () => setSelectedCell({ rowIndex: rowIndex!, columnKey: 'id' }),
                className: getCellClass(rowIndex!, 'id'),
            }),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            onCell: (_, rowIndex) => ({
                onClick: () => setSelectedCell({ rowIndex: rowIndex!, columnKey: 'name' }),
                className: getCellClass(rowIndex!, 'name'),
            }),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            onCell: (_, rowIndex) => ({
                onClick: () => setSelectedCell({ rowIndex: rowIndex!, columnKey: 'description' }),
                className: getCellClass(rowIndex!, 'description'),
            }),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            onCell: (_, rowIndex) => ({
                onClick: () => setSelectedCell({ rowIndex: rowIndex!, columnKey: 'amount' }),
                className: getCellClass(rowIndex!, 'amount'),
            }),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            onCell: (_, rowIndex) => ({
                onClick: () => setSelectedCell({ rowIndex: rowIndex!, columnKey: 'status' }),
                className: getCellClass(rowIndex!, 'status'),
            }),
        },
    ];

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

                        <button className="btn btn-danger" onClick={handleAddDelete}>
                            Delete Cell
                        </button>


                        <button className="btn btn-danger" onClick={handleAddDelete}>
                            Delete Cell
                        </button>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    <Table<DataType>
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>

            <style jsx>{`
                .selected-cell {
                    background-color: #ffd6d6 !important;
                    cursor: pointer;
                }
            `}</style>
        </>
    );
};

export default Sale;
