import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaRegEye } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import baseUrl from "../../../helpers/baseUrl";
import ViewOrderProduct from './ViewOrderProduct';
import { BsThreeDotsVertical } from 'react-icons/bs';
import NoteModal from './NoteModal';
import TrackingModal from './TrackingModal';
import { MDBDataTable } from 'mdbreact';
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";





const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [courierFilter, setCourierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10)
    console.log(limit);


    const pageRange = 2;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };


    const onPageChange = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        setCurrentPage(page);
    };


    const toggleNoteModal = () => {
        setIsNoteModalOpen(!isNoteModalOpen);
    };

    const openNoteModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsNoteModalOpen(true);
    };


    const handleTrackingOpenModal = (orderId) => {
        setTrackingOrderId(orderId);
        setTrackingModalOpen(true);
    };


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    useEffect(() => {
        const loadOrders = async (page = 1) => {
            const { orders, totalPages, currentPage } = await fetchOrders(page, limit);
            setOrders(orders);
            setFilteredOrders(orders)
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
        };
        loadOrders(currentPage);
    }, [currentPage, limit]);


    const fetchOrders = async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${baseUrl}/api/orders`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return {
                orders: [],
                totalOrders: 0,
                totalPages: 1,
                currentPage: 1
            };
        }
    };


    const handleStatusChange = async (orderId, newStatus) => {
        // Optimistically update the UI
        const previousOrders = [...orders];
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                // Check if 'status' is defined and has elements
                if (order?._id === orderId && Array.isArray(order.status)) {
                    const updatedStatus = [...order.status, { name: newStatus }];
                    return { ...order, status: updatedStatus };
                }
                return order;
            })
        );

        try {
            const userId = JSON.parse(localStorage.getItem('userId'));
            const data = { status: newStatus, userId };

            // Send a PATCH request to the server to update the status
            const response = await fetch(`${baseUrl}/api/orders/status/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update order status');
            }

            // Update the state with the confirmed data from the server
            const updatedOrder = await response.json();


            // Optionally, show a success message
            alert('Order status updated successfully');

            const loadOrders = async (page = 1) => {
                const { orders, totalPages, currentPage } = await fetchOrders(page, limit);
                setOrders(orders);
                setFilteredOrders(orders)
                setTotalPages(totalPages);
                setCurrentPage(currentPage);
            };
            loadOrders(currentPage);
        } catch (error) {
            // Rollback the UI if there's an error
            setOrders(previousOrders);
            console.error(error);
            alert(error.message || 'An error occurred while updating the order status');
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
        filterOrders(orders, status, courierFilter, dateFilter, searchTerm);
    };

    const handleFilterByCourier = (courier) => {
        setCourierFilter(courier);
        filterOrders(orders, statusFilter, courier, dateFilter, searchTerm);
    };

    const handleFilterByDate = (date) => {
        setDateFilter(date);
        filterOrders(orders, statusFilter, courierFilter, date, searchTerm);
    };

    const handleSearchTermChange = (searchTerm) => {
        setSearchTerm(searchTerm);
        filterOrders(orders, statusFilter, courierFilter, dateFilter, searchTerm);
    };


    const filterOrders = (orders, status, courier, date, searchTerm) => {
        const filtered = orders?.filter(order => {
            const statusMatches = status ? (order.lastStatus && order.lastStatus.name === status) : true;
            const courierMatches = courier ? (order.courier === courier) : true;
            const dateMatches = date ? new Date(order.createdAt).toISOString().startsWith(date) : true;
            const searchTermMatches = searchTerm
                ? order.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            return statusMatches && courierMatches && dateMatches && searchTermMatches;
        });

        setFilteredOrders(filtered);
    };


    useEffect(() => {
        filterOrders(orders, statusFilter, courierFilter, dateFilter, searchTerm);
    }, [orders, statusFilter, courierFilter, dateFilter, searchTerm]);




    const getStatusCount = (orders, status) => {
        return orders?.filter(order =>
            order.lastStatus.name === status
        ).length;
    };

    console.log(orders);



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

                        <div className="shadow-md text-center py-2 bg-[#620c9f21]" onClick={() => handleFilterByStatus('sendToCourier')}>
                            <p className="text-2xl font-bold text-[#610C9F]">{getStatusCount(orders, 'sendToCourier')}</p>
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
                        <div className="shadow-md text-center py-2 bg-[#c84a312a]" onClick={() => handleFilterByStatus('returnWithDeliveryCharge')}>
                            <p className="text-2xl font-bold text-[#C84B31]">{getStatusCount(orders, 'returnWithDeliveryCharge')}</p>
                            <p className="font-semibold text-[#C84B31]">Return With DeliveryCharge</p>
                        </div>
                        <div className="shadow-md text-center py-2 bg-[#c84a312a]" onClick={() => handleFilterByStatus('return')}>
                            <p className="text-2xl font-bold text-[#C84B31]">{getStatusCount(orders, 'return')}</p>
                            <p className="font-semibold text-[#C84B31]">Return</p>
                        </div>


                        <div className="shadow-md text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('exchange')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{getStatusCount(orders, 'exchange')}</p>
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
                                    className="select select-bordered"
                                    onChange={(e) => handleFilterByStatus(e.target.value)}
                                >
                                    <option value="new">New</option>
                                    <option value="pending">Pending</option>
                                    <option value="pendingPayment">Pending Payment</option>
                                    <option value="confirm">Confirm</option>
                                    <option value="hold">Hold</option>
                                    <option value="processing">Processing</option>
                                    <option value="sendToCourier">Sent to Courier</option>
                                    <option value="courierProcessing">Courier Processing</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="return">Return</option>
                                    <option value="exchange">Return Exchange</option>
                                    <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                    <option value="exchange">Exchange</option>
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
                                value={searchTerm}
                                onChange={(e) => handleSearchTermChange(e.target.value)}
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


                        <Row className='mt-4'>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <div className='flex justify-between items-center '>
                                            <select
                                                onChange={(e) => setLimit(e.target.value)}
                                                name="" id="" className='w-12'>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="150">150</option>
                                            </select>

                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="table border-collapse border-2 border-gray-100">
                                                {/* head */}
                                                <thead>
                                                    <tr>
                                                        <th className="border-2 border-gray-100">Serial</th>
                                                        <th className="border-2 border-gray-100">Info</th>
                                                        <th className="border-2 border-gray-100">Total Bill</th>
                                                        <th className="border-2 border-gray-100">Product</th>
                                                        <th className="border-2 border-gray-100">Status</th>
                                                        <th className="border-2 border-gray-100">Create</th>
                                                        <th className="border-2 border-gray-100">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredOrders?.map((item, index) => (
                                                        <tr key={item._id}>
                                                            <td className="border-2 border-gray-100">{index + 1}</td>
                                                            <td className="border-2 border-gray-100">
                                                                <div className="space-y-1">
                                                                    <p className="font-bold">
                                                                        {`${('0' + new Date(item.createdAt).getDate()).slice(-2)}-${('0' + (new Date(item.createdAt).getMonth() + 1)).slice(-2)}-${new Date(item.createdAt).getFullYear().toString().slice(-2)}, ${new Date(item.createdAt).getHours() % 12 || 12}:${('0' + new Date(item.createdAt).getMinutes()).slice(-2)} ${new Date(item.createdAt).getHours() >= 12 ? 'PM' : 'AM'}`}
                                                                    </p>
                                                                    <p className="font-bold text-error">{item.serialId}</p>
                                                                    <p>{item.invoice}</p>
                                                                    <p>{item.date}</p>
                                                                    <p className="flex items-center gap-1">
                                                                        <span><CgProfile /></span>
                                                                        <span className="font-semibold">{item.name}</span>
                                                                    </p>
                                                                    <p className="flex items-center gap-1">
                                                                        <span><FaPhoneAlt /></span>
                                                                        <span className="font-semibold">{item.phone}</span>
                                                                    </p>
                                                                    <p className="flex gap-1 italic"><span className="">{item.address}</span></p>
                                                                    <p className="text-red-500">{item.orderNotes}</p>
                                                                </div>
                                                            </td>
                                                            <td className="border-2 border-gray-100">
                                                                <div className="">
                                                                    <p className="text-right">Total Bill: {item.totalAmount + item.discount} TK</p>
                                                                    <p className="text-right">Delivery Charge: {item.deliveryCharge} TK</p>
                                                                    <p className="text-right">Discount: {item.discount} TK</p>
                                                                    <p className="text-right">Admin Discount: {item.adminDiscount} TK</p>
                                                                    <hr />
                                                                    <p className="font-bold text-right">Grand Total: {item.grandTotal} TK</p>
                                                                    <p className="font-bold text-green-500 text-right">Advanced: {item.advanced} TK</p>
                                                                    <p className="text-right">Available: {item.grandTotal - item.advanced} TK</p>
                                                                </div>
                                                            </td>
                                                            <td className=" flex gap-2 items-end">
                                                                {item?.cartItems?.slice(0, 2).map(c => {
                                                                    const sizeDetail = c?.productId?.sizeDetails?.find(sizeDetail => sizeDetail?.size === c?.size);
                                                                    return (
                                                                        <div key={c?._id} className="shadow-md rounded-md w-40 h-[310px]">
                                                                            <div className="px-2">
                                                                                <div className="relative">
                                                                                    <img className="w-[140px] mx-auto" src={`${baseUrl}/${c?.productId?.images[0]}`} alt={c?.productId?.productName} />
                                                                                    <p className="absolute bottom-2 left-2 bg-error text-white px-1 rounded-md">{c?.productId?.salePrice} Taka</p>
                                                                                </div>
                                                                                <p className="font-semibold pb-2 text-center">{c?.productId?.productName}</p>
                                                                                <p className="">
                                                                                    <span className="font-semibold">SKU:</span> {c?.productId?.SKU}
                                                                                </p>
                                                                                <p className="">
                                                                                    <span className="font-semibold">Quantity:</span> {c?.quantity}
                                                                                </p>
                                                                                {sizeDetail && (
                                                                                    <>
                                                                                        <p className="">
                                                                                            <span className="font-semibold">Size:</span> <span className="italic">{sizeDetail.barcode}</span> ({sizeDetail.size})
                                                                                        </p>
                                                                                        <p className="">
                                                                                            <span className="font-semibold">Stock:</span> {sizeDetail.openingStock}
                                                                                        </p>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {item.cartItems.length > 2 && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedOrder(item);
                                                                            toggleModal();
                                                                        }}
                                                                        className="btn btn-sm btn-primary text-white"
                                                                    >
                                                                        ...more {item.cartItems.length - 2}+
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="border-2 border-gray-100">
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <select
                                                                            className={`select select-bordered w-28 ${item?.status[item?.status?.length - 1]?.name === 'confirm'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : item?.status[item?.status?.length - 1]?.name === 'cancel'
                                                                                    ? 'bg-red-100 text-red-700'
                                                                                    : item?.status[item?.status?.length - 1]?.name === 'processing'
                                                                                        ? 'bg-yellow-100 text-yellow-700'
                                                                                        : item?.status[item?.status.length - 1]?.name === 'sendToCourier'
                                                                                            ? 'bg-sky-100 text-sky-700'
                                                                                            : ''
                                                                                }`}
                                                                            value={item?.status[item?.status?.length - 1]?.name || 'new'}
                                                                            onChange={(e) => handleStatusChange(item?._id, e.target.value)}
                                                                        >
                                                                            <option value="new">New</option>
                                                                            <option value="pending">Pending</option>
                                                                            <option value="pendingPayment">Pending Payment</option>
                                                                            <option value="confirm">Confirm</option>
                                                                            <option value="hold">Hold</option>
                                                                            <option value="processing">Processing</option>
                                                                            <option value="sendToCourier">Sent to Courier</option>
                                                                            <option value="courierProcessing">Courier Processing</option>
                                                                            <option value="delivered">Delivered</option>
                                                                            <option value="return">Return</option>
                                                                            <option value="exchange">Return Exchange</option>
                                                                            <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                                                            <option value="exchange">Exchange</option>
                                                                            <option value="cancel">Cancel</option>
                                                                        </select>
                                                                    </div>

                                                                    <div>
                                                                        <select
                                                                            className="select select-bordered w-28"
                                                                            value={item.courier}
                                                                            onChange={(e) => handleCourierChange(item._id, e.target.value)}
                                                                        >
                                                                            <option value="courier">Courier</option>
                                                                            <option value="user1">User1</option>
                                                                            <option value="user2">User2</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border-2 border-gray-100">
                                                                <div className="space-y-1">
                                                                    <div className="text-center">
                                                                        <a href={`/invoice/${item._id}`} className="btn btn-sm bg-green-100 text-green-700">
                                                                            Print
                                                                        </a>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <button onClick={() => handleTrackingOpenModal(item._id)} className="text-blue-500 text-xl">
                                                                            <FaRegEye />
                                                                        </button>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <button onClick={() => openNoteModal(item._id)} className="text-blue-500 btn btn-xs">
                                                                            Add Note
                                                                        </button>
                                                                        <NoteModal />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border-2 border-gray-100">
                                                                <div className="dropdown dropdown-top dropdown-end">
                                                                    <div tabIndex={0} role="button" className="btn btn-sm m-1"><BsThreeDotsVertical /></div>
                                                                    <ul tabIndex={0} className="dropdown-content space-y-3 menu bg-base-100 rounded-box z-[1] p-2 shadow">
                                                                        <li>
                                                                            <a href={`/manage-orders/${item._id}`} className="btn btn-sm text-success text-xl">
                                                                                <FaEdit />
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* <div className="flex justify-center mt-4">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Previous
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const pageNumber = i + 1;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`px-4 py-2 rounded mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Next
                                            </button>
                                        </div> */}
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={() => onPageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Prev
                                            </button>

                                            {getPageNumbers().map((pageNumber, index) => {
                                                if (pageNumber === '...') {
                                                    return (
                                                        <span key={index} className="px-4 py-2 mx-1 text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => onPageChange(pageNumber)}
                                                        className={`px-4 py-2 rounded mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => onPageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Next
                                            </button>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                </Container>
                <NoteModal
                    isOpen={isNoteModalOpen}
                    toggle={toggleNoteModal}
                    orderId={selectedOrderId}
                />
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
