import { Breadcrumbs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios';
import Modal from '../../../components/Common/Modal'; // Ensure the correct import path for the Modal component
import { Link } from 'react-router-dom';

const PurchaseList = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [supplierFilter, setSupplierFilter] = useState('');
    const [invoiceFilter, setInvoiceFilter] = useState('');
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');

    // Fetch purchase data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/purchase');
                const data = response.data;

                // Transform data into the format needed for the table
                const transformedData = data.map((purchase) => ({
                    id: purchase._id,
                    date: new Date(purchase.purchaseDate).toLocaleDateString(),
                    invoiceNo: purchase.invoiceNo,
                    supplier: purchase.supplier ? purchase.supplier.name : 'Unknown',
                    totalAmount: purchase.totalAmount,
                    totalPay: purchase.paymentTypes.reduce((sum, payment) => sum + payment.amount, 0),
                    totalDue: purchase.due,
                    items: purchase.items, // Add items to display in the modal
                    purchaseDate: purchase.purchaseDate,
                    paymentTypes: purchase.paymentTypes,
                }));

                setInvoices(transformedData);
                setFilteredInvoices(transformedData); // Initialize filteredInvoices
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Apply filters to the invoice list
    useEffect(() => {
        const applyFilters = () => {
            let filtered = invoices;

            if (supplierFilter) {
                filtered = filtered.filter(invoice =>
                    invoice.supplier.toLowerCase().includes(supplierFilter.toLowerCase())
                );
            }

            if (invoiceFilter) {
                filtered = filtered.filter(invoice =>
                    invoice.invoiceNo.toLowerCase().includes(invoiceFilter.toLowerCase())
                );
            }

            if (fromDateFilter) {
                filtered = filtered.filter(invoice =>
                    new Date(invoice.date) >= new Date(fromDateFilter)
                );
            }

            if (toDateFilter) {
                filtered = filtered.filter(invoice =>
                    new Date(invoice.date) <= new Date(toDateFilter)
                );
            }

            setFilteredInvoices(filtered);
        };

        applyFilters();
    }, [invoices, supplierFilter, invoiceFilter, fromDateFilter, toDateFilter]);

    // Handle view button click to show purchase details in the modal
    const handleViewClick = (purchase) => {
        setSelectedPurchase(purchase);
        setModalOpen(true);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Invoices" breadcrumbItem="Invoice Detail" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Purchase List</h2>
                            <Link to="/add-purchase">
                                <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center">
                                    <span className="mr-2">+</span> Add New Purchase
                                </button>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center mb-4">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={supplierFilter}
                                    onChange={(e) => setSupplierFilter(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    placeholder="Supplier Name"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="date"
                                    value={fromDateFilter}
                                    onChange={(e) => setFromDateFilter(e.target.value)}
                                    className="border border-gray-300 p-2 rounded"
                                    placeholder="From"
                                />
                                <span className="px-2">To</span>
                                <input
                                    type="date"
                                    value={toDateFilter}
                                    onChange={(e) => setToDateFilter(e.target.value)}
                                    className="border border-gray-300 p-2 rounded"
                                    placeholder="To"
                                />
                            </div>
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={invoiceFilter}
                                    onChange={(e) => setInvoiceFilter(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    placeholder="Invoice"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setSupplierFilter('');
                                        setInvoiceFilter('');
                                        setFromDateFilter('');
                                        setToDateFilter('');
                                    }}
                                    className="bg-red-500 text-white py-2 px-4 rounded"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-md rounded-md">
                            <thead>
                                <tr className="bg-green-600 text-white">
                                    <th className="px-6 py-2 text-left">Sl</th>
                                    <th className="px-6 py-2 text-left">Date</th>
                                    <th className="px-6 py-2 text-left">Invoice No</th>
                                    <th className="px-6 py-2 text-left">Supplier</th>
                                    <th className="px-6 py-2 text-left">Total Amount</th>
                                    <th className="px-6 py-2 text-left">Total Pay</th>
                                    <th className="px-6 py-2 text-left">Total Due</th>
                                    <th className="px-6 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice, index) => (
                                    <tr key={invoice.id} className="border-b">
                                        <td className="px-6 py-2">{index + 1}</td>
                                        <td className="px-6 py-2">{invoice.date}</td>
                                        <td className="px-6 py-2">{invoice.invoiceNo}</td>
                                        <td className="px-6 py-2">{invoice.supplier}</td>
                                        <td className="px-6 py-2">{invoice.totalAmount}</td>
                                        <td className="px-6 py-2">{invoice.totalPay}</td>
                                        <td className="px-6 py-2">{invoice.totalDue}</td>
                                        <td className="px-6 py-2">
                                            <div className="dropdown dropdown-top dropdown-end">
                                                <div
                                                    tabIndex={0}
                                                    role="button"
                                                    className="btn btn-sm m-1"
                                                >
                                                    Action ⬇️
                                                </div>
                                                <ul
                                                    tabIndex={0}
                                                    className="dropdown-content space-y-3 menu bg-base-100 rounded-box z-[1] p-2 shadow"
                                                >
                                                    <button
                                                        onClick={() => handleViewClick(invoice)}
                                                        className="btn btn-sm text-success text-xl"
                                                    >
                                                        View
                                                    </button>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>

            {/* Modal for viewing purchase details */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Purchase Details"
            >
                {selectedPurchase ? (
                    <div className="p-4">
                        {/* Business and Supplier Details */}
                        <div className="flex justify-between mb-4">
                            <div>
                                <p><strong>Business:</strong> Estarch</p>
                                <p>Dhaka, Bangladesh</p>
                                <p><strong>Mobile:</strong> 01777215168</p>
                            </div>
                            <div>
                                <p><strong>Supplier:</strong> {selectedPurchase.supplier}</p>
                                <p><strong>Mobile:</strong> 123</p>
                            </div>
                            <div>
                                <p><strong>Invoice No:</strong> {selectedPurchase.invoiceNo}</p>
                                <p><strong>Reference:</strong> #</p>
                                <p><strong>Date:</strong> {new Date(selectedPurchase.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Created By:</strong> Estarch</p>
                                <p>({new Date(selectedPurchase.purchaseDate).toLocaleString()})</p>
                                <p><strong>Updated By:</strong></p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="min-w-full border-collapse bg-white shadow-md rounded-md">
                            <thead>
                                <tr className="bg-green-600 text-white">
                                    <th className="px-4 py-2 border">SL</th>
                                    <th className="px-4 py-2 border">Product Name</th>
                                    <th className="px-4 py-2 border">Quantity</th>
                                    <th className="px-4 py-2 border">Rate</th>
                                    <th className="px-4 py-2 border">Subtotal</th>
                                    <th className="px-4 py-2 border">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPurchase.items.map((item, idx) => (
                                    <tr key={idx} className="bg-gray-100">
                                        <td className="px-4 py-2 border text-center">{idx + 1}</td>
                                        <td className="px-4 py-2 border text-center">{item.product.productName}</td>
                                        <td className="px-4 py-2 border text-center">{item.quantity} Pics</td>
                                        <td className="px-4 py-2 border text-center">{item.purchasePrice}</td>
                                        <td className="px-4 py-2 border text-center">{item.subtotal}</td>
                                        <td className="px-4 py-2 border text-center">{item.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary Section */}
                        <div className="flex justify-end mt-4">
                            <div className="space-y-2">
                                <p><strong>Total Qty:</strong> {selectedPurchase.items.reduce((sum, item) => sum + item.quantity, 0)} Pics</p>
                                <p><strong>Total Amount:</strong> TK {selectedPurchase.totalAmount}</p>
                                <p><strong>Total Paying:</strong> TK {selectedPurchase.totalPay}</p>
                                <p><strong>Total Due:</strong> TK {selectedPurchase.totalDue}</p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setModalOpen(false)} className="btn btn-red bg-black text-white">Close</button>
                        </div>
                    </div>
                ) : (
                    <p>No purchase details available.</p>
                )}
            </Modal>
        </React.Fragment>
    );
};

export default PurchaseList;
