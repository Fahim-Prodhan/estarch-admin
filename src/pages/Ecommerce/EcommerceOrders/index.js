import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { Container } from 'reactstrap';

// Status hierarchy (only forward movement is allowed)
const statusHierarchy = ['new', 'pending', 'confirm', 'processing', 'courier', 'delivered', 'cancel'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [courierFilter, setCourierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeNoteInput, setActiveNoteInput] = useState(null);
    const [notes, setNotes] = useState({});

    useEffect(() => {
        const loadOrders = async () => {
            const initialOrders = await fetchOrders();
            setOrders(initialOrders);
            setFilteredOrders(initialOrders);
        };
        loadOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order._id === orderId) {
                const currentStatusIndex = statusHierarchy.indexOf(order.status);
                const newStatusIndex = statusHierarchy.indexOf(newStatus);

                if (newStatusIndex > currentStatusIndex) {
                    return { ...order, status: newStatus };
                }
            }
            return order;
        });

        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(updatedOrders);
            filterOrders(updatedOrders, statusFilter, courierFilter, dateFilter);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCourierChange = async (orderId, newCourier) => {
        const updatedOrders = orders.map(order => {
            if (order._id === orderId) {
                return { ...order, courier: newCourier };
            }
            return order;
        });

        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/courier`, { courier: newCourier });
            setOrders(updatedOrders);
            filterOrders(updatedOrders, statusFilter, courierFilter, dateFilter);
        } catch (error) {
            console.error('Error updating courier:', error);
        }
    };

    const handleAddCartItems = async (orderId, newCartItems) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/cart-items`, { cartItems: newCartItems });
            // Update local state or refetch orders here
        } catch (error) {
            console.error('Error adding cart items:', error);
        }
    };

    const createOrder = async (orderData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            setOrders([...orders, response.data]);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
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

    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    const toggleDropdown = (orderId) => {
        setActiveDropdown(activeDropdown === orderId ? null : orderId);
    };

    const handleAddNoteClick = (orderId) => {
        setActiveNoteInput(orderId);
        setActiveDropdown(null);
    };

    const handleNoteChange = (orderId, note) => {
        setNotes({ ...notes, [orderId]: note });
    };

    const handleNoteSave = async (orderId) => {
        const updatedOrders = orders.map(order => {
            if (order._id === orderId) {
                return { ...order, note: notes[orderId] || order.note };
            }
            return order;
        });

        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/note`, { note: notes[orderId] });
            setOrders(updatedOrders);
            setActiveNoteInput(null);
        } catch (error) {
            console.error('Error saving note:', error);
        }
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
                                <button className="btn btn-sm bg-error text-white border-none" onClick={() => createOrder(/* Order Data Here */)}>
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
                                        <tr key={order._id}>
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
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
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
                                                    onChange={(e) => handleCourierChange(order._id, e.target.value)}
                                                >
                                                    <option value="courier">Courier</option>
                                                    <option value="user1">User1</option>
                                                    <option value="user2">User2</option>
                                                </select>
                                            </td>
                                            <td>{order.visitor}</td>
                                            <td>{order.note}</td>
                                            <td>
                                                <button onClick={() => toggleDropdown(order._id)}>
                                                    <FaEllipsisV />
                                                </button>
                                                {activeDropdown === order._id && (
                                                    <div className="dropdown-content">
                                                        <ul>
                                                            <li onClick={() => handleAddNoteClick(order._id)}>Add Note</li>
                                                            <li>Assign Employee</li>
                                                            <li>Other Option</li>
                                                        </ul>
                                                    </div>
                                                )}
                                                {activeNoteInput === order._id && (
                                                    <div>
                                                        <textarea
                                                            value={notes[order._id] || ''}
                                                            onChange={(e) => handleNoteChange(order._id, e.target.value)}
                                                            className="textarea textarea-bordered mt-2"
                                                        />
                                                        <button
                                                            onClick={() => handleNoteSave(order._id)}
                                                            className="btn btn-sm btn-success mt-2"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                )}
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
