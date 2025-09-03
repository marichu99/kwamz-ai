import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import DocumentForm from './DocumentForm';
import '../styles/table.css';

const KYCPage = () => {
    const [showDocumentForm, setShowDocumentForm] = useState(false);
    const [kycData, setKycData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Extract data fetching into a separate function
    const fetchKycData = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/document/get-kyc`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setKycData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycData();
    }, []);

    const columns = useMemo(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Requester', accessorKey: 'user_name' },
        { header: 'Time Paid', accessorKey: 'time_paid' },
        { header: 'Phone Number', accessorKey: 'phone_number' },
        { header: 'Payment Ref', accessorKey: 'reference_code' },
    ], []);

    const table = useReactTable({
        data: kycData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handlePerformKYC = () => setShowDocumentForm(true);

    const handleFormClose = () => {
        setShowDocumentForm(false);
        // Refresh data when form closes
        fetchKycData();
    };

    return (
        <div>
            <h2>KYC</h2>

            <div className="button-container">
                <button onClick={handlePerformKYC} className='button-blue'>
                    Perform KYC
                </button>
            </div>

            {loading && <div>Loading...</div>}

            <table className="custom-table">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-toolbar">
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {'<<'}
                </button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {'<'}
                </button>
                <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {'>'}
                </button>
                <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    {'>>'}
                </button>
            </div>

            {showDocumentForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <DocumentForm 
                            onClose={handleFormClose}
                            onSubmitSuccess={fetchKycData}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCPage;