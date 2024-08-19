import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import baseUrl from "../../../helpers/baseUrl";
import ViewOrderProduct from './ViewOrderProduct';
import productIcon from '../../../assets/images/product-icon.png'
import { BsThreeDotsVertical } from 'react-icons/bs';
import NoteModal from './NoteModal';
import TrackingModal from './TrackingModal';
import { MdDeleteSweep } from 'react-icons/md';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';

const statusHierarchy = [
    'new', 'pending', 'pendingPayment', 'confirm', 'hold',
    'processing', 'sentToCourier', 'courierProcessing', 'delivered',
    'return', 'returnExchange', 'returnWithDeliveryCharge', 'exchange', 'cancel'
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [courierFilter, setCourierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [data, setData] = useState({ columns: [], rows: [] })


    useEffect(() => {
        // Simulate fetching data from an API or static JSON file
        const formattedData = {
            columns: [
                { label: "Serial", field: "serial", sort: "asc", width: 150 },
                { label: "Total Bill", field: "total_bill", sort: "asc", width: 270 },
                { label: "Product", field: "product", sort: "asc", width: 200 },
                { label: "Status", field: "status", sort: "asc", width: 50 },
                { label: "Courier", field: "courier", sort: "asc", width: 100 },
                { label: "Create", field: "create", width: 100 },
                { label: "Action", field: "action", width: 100 },
            ],
            rows: filteredOrders.map(item => ({
                serial: (
                    <div className='w-36'>
                        <p className="font-bold">{item.serialId}</p>
                        <p>{item.invoice}</p>
                        <p>{item.date}</p>
                        <p>{item.name}</p>
                        <p>{item.address}</p>
                        <p>{item.phone}</p>
                        <p className="text-red-500">{item.orderNotes}</p>
                    </div>
                ),
                total_bill: (
                    <div className='md:w-full w-36'>
                        <p className='text-right'>Total Bill: {item.totalAmount} TK</p>
                        <p className='text-right'>Delivery Charge: {item.deliveryCharge} TK</p>
                        <p className='text-right'>Discount: {item.discount} TK</p>
                        <hr />
                        <p className="font-bold text-right">Grand Total: {item.grandTotal} TK</p>
                        <p className="font-bold text-green-500 text-right">Advanced: {item.advanced} TK</p>
                        <p className='text-right'>Available: {item.grandTotal - item.advanced} TK</p>
                    </div>
                ),
                product: (

                    <button onClick={() => {
                        setSelectedOrder(item);
                        toggleModal();
                    }} className="btn btn-sm btn-error text-white w-36">View Product</button>

                ),
                status: (
                    <select
                        className="select select-bordered w-36"
                        value={item.status[item.status.length - 1]?.name || 'new'}  // Ensure the latest status is displayed
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}  // Call the function on change
                    >
                        <option value="new">New</option>
                        <option value="pending">Pending</option>
                        <option value="pendingPayment">Pending Payment</option>
                        <option value="confirm">Confirm</option>
                        <option value="hold">Hold</option>
                        <option value="processing">Processing</option>
                        <option value="sentToCourier">Sent to Courier</option>
                        <option value="courierProcessing">Courier Processing</option>
                        <option value="return">Return</option>
                        <option value="returnExchange">Return Exchange</option>
                        <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                        <option value="exchange">Exchange</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancel">Cancel</option>
                    </select>
                ),
                courier: (
                    <select
                        className="select select-bordered w-36"
                        value={item.courier}
                        onChange={(e) => handleCourierChange(item._id, e.target.value)}
                    >
                        <option value="courier">Courier</option>
                        <option value="user1">User1</option>
                        <option value="user2">User2</option>
                    </select>
                ),
                create: (
                    <button onClick={() => handleTrackingOpenModal(item._id)} className="text-blue-500 text-xl" >
                        <FaRegEye />
                    </button>
                ),
                action: (
                    <div className="dropdown dropdown-top dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm m-1"><BsThreeDotsVertical />
                        </div>
                        <ul tabIndex={0} className="dropdown-content space-y-3 menu bg-base-100 rounded-box z-[1] p-2 shadow">
                            <li>
                                <a href={`/manage-orders/${item._id}`} className="btn btn-sm text-success text-xl">
                                    <FaEdit />
                                </a>

                            </li>
                            <li>
                                <a href={`/invoice/${item._id}`} className="btn btn-sm text-success text-base">
                                    Print
                                </a>

                            </li>
                        </ul>
                    </div>
                ),
            })),
        }
        setData(formattedData)
    }, [filteredOrders])
    // console.log(data);

    const handleTrackingOpenModal = (orderId) => {
        setTrackingOrderId(orderId);
        setTrackingModalOpen(true);
    };


    const toggleNoteModal = (orderId) => {
        if (isNoteModalOpen) {
            setIsNoteModalOpen(false);
            setSelectedOrderId(null);
        } else {
            setIsNoteModalOpen(true);
            setSelectedOrderId(orderId);
        }
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleDropdown = (orderId) => {
        setActiveDropdown(activeDropdown === orderId ? null : orderId);
    };

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
            const response = await axios.get(`${baseUrl}/api/orders`);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const userId = JSON.parse(localStorage.getItem('userId'));
            const data = {
                status: newStatus,
                userId
            };

            // Send a PATCH request to the server to update the status
            const response = await fetch(`${baseUrl}/api/orders/status/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update order status');
            }

            // Update UI with the new order data
            const updatedOrder = await response.json();

            // Find and update the order in the state (assuming you have state management here)
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );

            // Optionally, show a success message
            alert('Order status updated successfully');
        } catch (error) {
            // Handle errors (unauthenticated, server issues, etc.)
            console.error(error);
            alert(error.message);
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
            await axios.patch(`${baseUrl}/api/orders/${orderId}/courier`, { courier: newCourier });
            setOrders(updatedOrders);
            filterOrders(updatedOrders, statusFilter, courierFilter, dateFilter);
        } catch (error) {
            console.error('Error updating courier:', error);
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
            const statusMatches = status && status !== 'all'
                ? order.status.some(statusEntry => statusEntry.name === status)
                : true;

            const courierMatches = courier ? order.courier === courier : true;

            const dateMatches = date
                ? new Date(order.createdAt).toISOString().startsWith(date) // Ensure `date` is in a comparable format
                : true;

            return statusMatches && courierMatches && dateMatches;
        });

        setFilteredOrders(filtered);
    };

    useEffect(() => {
        filterOrders(orders, statusFilter, courierFilter, dateFilter);
    }, [orders, statusFilter, courierFilter, dateFilter]);



    const getStatusCount = (orders, status) => {
        return orders.filter(order =>
            order.status.some(statusEntry => statusEntry.name === status)
        ).length;
    };


    return (
        <React.Fragment>
            <div className="mt-20 mb-20">
                <Container>
                    {/* Status Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        <div className="shadow-md text-center py-2 bg-[#ff7e3e1d]" onClick={() => handleFilterByStatus('new')}>
                            <p className="text-2xl font-bold text-[#FF7F3E]">{getStatusCount(orders, 'new')}</p>
                            <p className="font-semibold text-[#FF7F3E]">New Order</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#af47d223]" onClick={() => handleFilterByStatus('pending')}>
                            <p className="text-2xl font-bold text-[#AF47D2]">{getStatusCount(orders, 'pending')}</p>
                            <p className="font-semibold text-[#AF47D2]">Pending</p>
                        </div>



                        <div className="shadow-md text-center py-2 bg-[#1b424225]" onClick={() => handleFilterByStatus('pendingPayment')}>
                            <p className="text-2xl font-bold text-[#1B4242]">{getStatusCount(orders, 'pendingPayment')}</p>
                            <p className="font-semibold text-[#1B4242]">Pending Payment</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#40a57821]" onClick={() => handleFilterByStatus('confirm')}>
                            <p className="text-2xl font-bold text-[#40A578]">{getStatusCount(orders, 'confirm')}</p>
                            <p className="font-semibold text-[#40A578]">Confirm</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#ff204d2a]" onClick={() => handleFilterByStatus('hold')}>
                            <p className="text-2xl font-bold text-[#FF204E]">{getStatusCount(orders, 'hold')}</p>
                            <p className="font-semibold text-[#FF204E]">Hold</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#ff3ea523]" onClick={() => handleFilterByStatus('processing')}>
                            <p className="text-2xl font-bold text-[#FF3EA5]">{getStatusCount(orders, 'processing')}</p>
                            <p className="font-semibold text-[#FF3EA5]">Processing</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#620c9f21]" onClick={() => handleFilterByStatus('courier')}>
                            <p className="text-2xl font-bold text-[#610C9F]">{getStatusCount(orders, 'courier')}</p>
                            <p className="font-semibold text-[#610C9F]">Sent to Courier</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#fa58b616]" onClick={() => handleFilterByStatus('courierProcessing')}>
                            <p className="text-2xl font-bold text-[#FA58B6]">{getStatusCount(orders, 'courierProcessing')}</p>
                            <p className="font-semibold text-[#FA58B6]">Courier Processing</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('delivered')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount(orders, 'delivered')}</p>
                            <p className="font-semibold text-[#8B9A46]">Delivered</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('partialReturn')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount(orders, 'partialReturn')}</p>
                            <p className="font-semibold text-[#8B9A46]">Partial Return</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#c84a312a]" onClick={() => handleFilterByStatus('return')}>
                            <p className="text-2xl font-bold text-[#C84B31]">{getStatusCount(orders, 'return')}</p>
                            <p className="font-semibold text-[#C84B31]">Return</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('returnExchange')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount(orders, 'returnExchange')}</p>
                            <p className="font-semibold text-[#8B9A46]">Return Exchange</p>
                        </div>

                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('cancel')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount(orders, 'cancel')}</p>
                            <p className="font-semibold text-[#8B9A46]">Cancel</p>
                        </div>
                    </div>


                    {/* Orders Table */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6">
                                <select
                                    className="select select-bordered"  // Fix this line to use order.status
                                    onChange={(e) => handleFilterByStatus(e.target.value)}  // Fix this line to call handleStatusChange
                                >
                                    <option value="new">New</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirm">Confirm</option>
                                    <option value="processing">Processing</option>
                                    <option value="pendingPayment">Pending Payment</option>
                                    <option value="hold">Hold</option>
                                    <option value="sentToCourier">Sent to Courier</option>
                                    <option value="courierProcessing">Courier Processing</option>
                                    <option value="return">Return</option>
                                    <option value="returnExchange">Return Exchange</option>
                                    <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                    <option value="exchange">Exchange</option>
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

                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <MDBDataTable responsive bordered data={data} />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* <div className="overflow-x-auto w-full mt-8">
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
                                                    <p className="text-red-500">{order.orderNotes}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <p className='text-right'>Total Bill: {order.totalAmount} TK</p>
                                                    <p className='text-right'>Delivery Charge: {order.deliveryCharge} TK</p>
                                                    <p className='text-right'>Discount: {order.discount} TK</p>
                                                    <hr />
                                                    <p className="font-bold text-right">Grand Total: {order.grandTotal} TK</p>
                                                    <p className="font-bold text-green-500 text-right">Advanced: {order.advanced} TK</p>
                                                    <p className='text-right'>Available: {order.grandTotal - order.advanced} TK</p>
                                                </div>
                                            </td>
                                            <td className='text-center grid justify-center gap-2'>
                                                <img className='w-16 mx-8' src={productIcon} alt="" />
                                                <button onClick={() => {
                                                    setSelectedOrder(order);
                                                    toggleModal();
                                                }} className="btn btn-sm btn-error text-white ">View Product</button>
                                            </td>
                                            <td>
                                                <select
                                                    className="select select-bordered"
                                                    value={order.status[order.status.length - 1]?.name || 'new'}  // Ensure the latest status is displayed
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}  // Call the function on change
                                                >
                                                    <option value="new">New</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="pendingPayment">Pending Payment</option>
                                                    <option value="confirm">Confirm</option>
                                                    <option value="hold">Hold</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="sentToCourier">Sent to Courier</option>
                                                    <option value="courierProcessing">Courier Processing</option>
                                                    <option value="return">Return</option>
                                                    <option value="returnExchange">Return Exchange</option>
                                                    <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                                    <option value="exchange">Exchange</option>
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
                                            <td>
                                                <button onClick={() => handleTrackingOpenModal(order._id)} className="text-blue-500 text-xl" >
                                                    <FaRegEye />
                                                </button>
                                            </td>
                                            <td>
                                                <div className="dropdown flex justify-center relative">
                                                    <div
                                                        tabIndex={0}
                                                        role="button"
                                                        className="btn m-1 btn-sm"
                                                        onClick={() => toggleDropdown(order._id)} // Toggle on click
                                                    >
                                                        <BsThreeDotsVertical />
                                                    </div>
                                                    <ul
                                                        tabIndex={0}
                                                        className={`dropdown-content absolute right-0 mt-1 bg-base-100 rounded-box z-10 p-2 shadow space-y-2 ${activeDropdown === order._id ? '' : 'hidden'}`} // Show/hide based on activeDropdown
                                                    >
                                                        <li>
                                                            <button className="btn btn-sm btn-accent text-white" onClick={() => toggleNoteModal()}>
                                                                Details
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button onClick={() => toggleNoteModal(order._id)} className="btn btn-sm text-success text-xl">
                                                                <FaEdit />
                                                            </button>

                                                        </li>
                                                        <li>
                                                            <Button color="primary">
                                                                Open Modal
                                                            </Button>
                                                        </li>
                                                    </ul>
                                                </div>

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                </Container>
                <ViewOrderProduct isOpen={isModalOpen} toggle={toggleModal} order={selectedOrder} />
                {selectedOrderId && (
                    <NoteModal
                        isOpen={isNoteModalOpen}
                        toggle={() => toggleNoteModal(selectedOrderId)}
                        orderId={selectedOrderId}
                    // other props as needed
                    />
                )}
                <TrackingModal
                    isOpen={trackingModalOpen}
                    toggle={() => setTrackingModalOpen(false)}
                    orderId={trackingOrderId}
                />
            </div>
        </React.Fragment>
    );
};

export default Orders;
