import React, { useState, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { Container } from 'reactstrap';

// Assuming this is the initial data for orders
const fetchOrders = () => {
    return [
        {
            id: 1,
            serialId: 'E-commerce',
            invoice: '454',
            date: '2024-07-02T10:00:00',
            name: 'Atikur Rahman',
            address: 'Mirpur, Dhaka',
            phone: '0170000000',
            notes: 'Customer Notes',
            totalBill: 1850,
            deliveryCharge: 130,
            discount: 100,
            grandTotal: 1930,
            advanced: 800,
            condition: 'Pending',
            product: 'PRODUCT',
            status: 'pending',
            courier: 'courier',
            visitor: 'Visitor',
            note: 'note',
            lastNote: 'Last Note',
        },
        {
            id: 2,
            serialId: 'E-commerce',
            invoice: '454',
            date: '2024-07-02T10:00:00',
            name: 'Atikur Rahman',
            address: 'Mirpur, Dhaka',
            phone: '0170000000',
            notes: 'Customer Notes',
            totalBill: 1850,
            deliveryCharge: 130,
            discount: 100,
            grandTotal: 1930,
            advanced: 800,
            condition: 'Pending',
            product: 'PRODUCT',
            status: 'pending',
            courier: 'courier',
            visitor: 'Visitor',
            note: 'note',
            lastNote: 'Last Note',
        },
        {
            id: 3,
            serialId: 'E-commerce',
            invoice: '454',
            date: '2024-07-02T10:00:00',
            name: 'Atikur Rahman',
            address: 'Mirpur, Dhaka',
            phone: '0170000000',
            notes: 'Customer Notes',
            totalBill: 1850,
            deliveryCharge: 130,
            discount: 100,
            grandTotal: 1930,
            advanced: 800,
            condition: 'Pending',
            product: 'PRODUCT',
            status: 'pending',
            courier: 'courier',
            visitor: 'Visitor',
            note: 'note',
            lastNote: 'Last Note',
        },
        // Add more orders as needed...
    ];
};

// Status hierarchy (only forward movement is allowed)
const statusHierarchy = ['new', 'pending', 'confirm', 'processing', 'courier', 'delivered', 'cancel'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [courierFilter, setCourierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const initialOrders = fetchOrders();
        setOrders(initialOrders);
        setFilteredOrders(initialOrders);
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                const currentStatusIndex = statusHierarchy.indexOf(order.status);
                const newStatusIndex = statusHierarchy.indexOf(newStatus);

                // Only allow status progression, not regression
                if (newStatusIndex > currentStatusIndex) {
                    return { ...order, status: newStatus };
                }
            }
            return order;
        });
        setOrders(updatedOrders);
        filterOrders(updatedOrders, statusFilter, courierFilter, dateFilter);
    };

    const handleCourierChange = (orderId, newCourier) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return { ...order, courier: newCourier };
            }
            return order;
        });
        setOrders(updatedOrders);
        filterOrders(updatedOrders, statusFilter, courierFilter, dateFilter);
    };

    const handleFilterByStatus = (status) => {
        setStatusFilter(status);
        filterOrders(orders, status, courierFilter, dateFilter);
    };

    const handleFilterByCourier = (courier) => {
        setCourierFilter(courier);
        filterOrders(orders, statusFilter, courier, dateFilter);
    };

    const handleFilterByDate = (date) => {
        setDateFilter(date);
        filterOrders(orders, statusFilter, courierFilter, date);
    };

    const filterOrders = (orders, status, courier, date) => {
        const filtered = orders.filter(order => {
            return (
                (status ? order.status === status : true) &&
                (courier ? order.courier === courier : true) &&
                (date ? order.date.startsWith(date) : true)
            );
        });
        setFilteredOrders(filtered);
    };

    // Calculate counts dynamically based on the current filtered orders
    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    return (
        <React.Fragment>
            <div className="mt-20 mb-20">
                <Container>
                    {/* Status Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        <div className="shadow-md text-center py-2 bg-[#4b70f52e]" onClick={() => handleFilterByStatus('')}>
                            <p className="text-2xl font-bold text-[#4B70F5]">{orders.length}</p>
                            <p className="font-semibold text-[#4B70F5]">ALL</p>
                        </div>

                        

                        <div className="shadow-md text-center py-2 bg-[#af47d223]" onClick={() => handleFilterByStatus('pending')}>
                            <p className="text-2xl font-bold text-[#AF47D2]">{getStatusCount('pending')}</p>
                            <p className="font-semibold text-[#AF47D2]">Pending</p>
                        </div>
                        <div className="shadow-md text-center py-2 bg-[#ff7e3e1d]" onClick={() => handleFilterByStatus('new')}>
                            <p className="text-2xl font-bold text-[#FF7F3E]">{getStatusCount('new')}</p>
                            <p className="font-semibold text-[#FF7F3E]">New Order</p>
                        </div>
                        <div className="shadow-md text-center py-2 bg-[#1b424225]" onClick={() => handleFilterByStatus('pendingPayment')}>
                            <p className="text-2xl font-bold text-[#1B4242]">{getStatusCount('pendingPayment')}</p>
                            <p className="font-semibold text-[#1B4242]">Pending Payment</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#40a57821]" onClick={() => handleFilterByStatus('confirm')}>
                            <p className="text-2xl font-bold text-[#40A578]">{getStatusCount('confirm')}</p>
                            <p className="font-semibold text-[#40A578]">CONFIRM</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#ff204d2a]" onClick={() => handleFilterByStatus('hold')}>
                            <p className="text-2xl font-bold text-[#FF204E]">{getStatusCount('hold')}</p>
                            <p className="font-semibold text-[#FF204E]">Hold</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#ff3ea523]" onClick={() => handleFilterByStatus('processing')}>
                            <p className="text-2xl font-bold text-[#FF3EA5]">{getStatusCount('processing')}</p>
                            <p className="font-semibold text-[#FF3EA5]">Processing</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#620c9f21]" onClick={() => handleFilterByStatus('courier')}>
                            <p className="text-2xl font-bold text-[#610C9F]">{getStatusCount('courier')}</p>
                            <p className="font-semibold text-[#610C9F]">Sent to Courier</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#fa58b616]" onClick={() => handleFilterByStatus('courierProcessing')}>
                            <p className="text-2xl font-bold text-[#FA58B6]">{getStatusCount('courierProcessing')}</p>
                            <p className="font-semibold text-[#FA58B6]">Courier Processing</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('delivered')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount('delivered')}</p>
                            <p className="font-semibold text-[#8B9A46]">Delivered</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#c84a312a]" onClick={() => handleFilterByStatus('return')}>
                            <p className="text-2xl font-bold text-[#C84B31]">{getStatusCount('return')}</p>
                            <p className="font-semibold text-[#C84B31]">Return</p>
                        </div>
                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('returnExchange')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount('returnExchange')}</p>
                            <p className="font-semibold text-[#8B9A46]">Return Exchange</p>
                        </div>
                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('cancel')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount('cancel')}</p>
                            <p className="font-semibold text-[#8B9A46]">Cancel</p>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6">
                                <select
                                    className="select select-bordered"
                                    value={statusFilter}
                                    onChange={(e) => handleFilterByStatus(e.target.value)}
                                >
                                    <option value="">Filter By Status</option>
                                    <option value="new">New</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirm">Confirm</option>
                                    <option value="processing">Processing</option>
                                    <option value="courier">Courier</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancel">Cancel</option>
                                </select>

                                <select
                                    className="select select-bordered"
                                    value={courierFilter}
                                    onChange={(e) => handleFilterByCourier(e.target.value)}
                                >
                                    <option value="">Filter By Courier</option>
                                    <option value="courier">Courier</option>
                                    <option value="user1">User1</option>
                                    <option value="user2">User2</option>
                                </select>

                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={dateFilter}
                                    onChange={(e) => handleFilterByDate(e.target.value)}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by Invoice No"
                                className="input input-bordered w-full max-w-xs"
                />
                 <div className="flex gap-6 md:mr-4">
                                <button className="btn btn-sm bg-error text-white border-none">
                                    <span>
                                        <IoIosAddCircle className="text-xl" />
                                    </span>
                                    Pos Order
                                </button>
                                <button className="btn btn-sm bg-success text-white border-none">
                                    My Orders
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto w-full mt-8">
                            <table className="table w-full table-compact">
                                <thead>
                                    <tr>
                                        <th>
                                            <label>
                                                <input type="checkbox" className="checkbox" />
                                            </label>
                                        </th>
                                        <th>Serial ID</th>
                                        <th>Total Bill</th>
                                        <th>Product</th>
                                        <th>Status</th>
                                        <th>Courier</th>
                                        <th>Create</th>
                                        <th>Note</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <label>
                                                    <input type="checkbox" className="checkbox" />
                                                </label>
                                            </td>
                                            <td>
                                                <div>
                                                    <p className="font-bold">{order.serialId}</p>
                                                    <p>{order.invoice}</p>
                                                    <p>{order.date}</p>
                                                    <p>{order.name}</p>
                                                    <p>{order.address}</p>
                                                    <p>{order.phone}</p>
                                                    <p className="text-red-500">{order.notes}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <p>Total Bill: {order.totalBill} TK</p>
                                                    <p>Delivery Charge: {order.deliveryCharge} TK</p>
                                                    <p>Discount: {order.discount} TK</p>
                                                    <hr />
                                                    <p className="font-bold">Grand Total: {order.grandTotal} TK</p>
                                                    <p className="font-bold text-green-500">Advanced: {order.advanced} TK</p>
                                                    <p>Available: {order.grandTotal - order.advanced} TK</p>
                                                </div>
                                            </td>
                                            <td>{order.product}</td>
                                            <td>
                                                <select
                                                    className="select select-bordered w-full"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirm">Confirm</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="courier">Courier</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancel">Cancel</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="select select-bordered w-full"
                                                    value={order.courier}
                                                    onChange={(e) => handleCourierChange(order.id, e.target.value)}
                                                >
                                                    <option value="courier">Courier</option>
                                                    <option value="user1">User1</option>
                                                    <option value="user2">User2</option>
                                                </select>
                                            </td>
                                            <td>{order.visitor}</td>
                                            <td>{order.note}</td>
                                            <td>
                                                {/* <button className="btn btn-sm btn-success">Update</button> */}
                                                <FaEllipsisV size={20} />    
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Orders;
