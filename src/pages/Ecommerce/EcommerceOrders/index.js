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
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import altImg from '../../../assets/avater.jpg'
import { Link } from 'react-router-dom';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('new');
    const [courierFilter, setCourierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10)
    const [count, setCount] = useState(1)
    const [search, setSearch] = useState('')
    const [orderObject, setOrderObject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchOrderNo, setSearchOrderNo] = useState('')
    const [courier, setCourier] = useState(null);
    const [apiKey, setApiKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [sentToCourierOrders, setSentToCourierOrders] = useState([])
    const [courierProcessingOrders, setCourierProcessingOrders] = useState([])


    const url = 'https://portal.packzy.com/api/v1'; // Replace with your API URL


    // 

    useEffect(() => {
        // Fetch the courier data by ID
        axios.get(`${baseUrl}/api/courier`)
            .then((res) => {
                const data = res.data.data[0];
                setCourier(data);
                setApiKey(data.apiKey);  // Set default API key to input
                setSecretKey(data.secretKey);  // Set default Secret key to input
            })
            .catch((err) => {
                console.error("Error fetching courier data", err);
            });

    }, []);

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


    const fetchData = () => {
        setLoading(true)
        fetch(`${baseUrl}/api/orders?page=${currentPage}&size=${limit}&search=${search}&date=${dateFilter}&status=${statusFilter}&searchOrderNo=${searchOrderNo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data.orders);
                setCount(data.totalProducts)
                setCurrentPage(data.currentPage)
                setTotalPages(data.totalPages)
                setLoading(false)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setLoading(false)
            });

        try {
            axios.get(`${baseUrl}/api/orders/get-sent-courier-orders`)
                .then(res => {
                    setSentToCourierOrders(res.data)
                })

        } catch (error) {
            console.error('Error fetching courier orders or statuses:', error);
        }

        // courier Processing orders
        try {
            axios.get(`${baseUrl}/api/orders/get-courier-processing-orders`)
                .then(res => {
                    setCourierProcessingOrders(res.data)
                })

        } catch (error) {
            console.error('Error fetching courier orders or statuses:', error);
        }
    };

    const fetchCount = () => {
        axios.get(`${baseUrl}/api/orders/status-count`)
            .then(res => {
                setOrderObject(res.data)
            })
    }


    useEffect(() => {
        // Check if courierProcessingOrders or sentToCourierOrders have values before calling the functions
        if (courierProcessingOrders.length > 0) {
            courierProcessingFun();
        }

        if (sentToCourierOrders.length > 0) {
            sentToCourierFun();
        }
    }, [courierProcessingOrders, sentToCourierOrders]); // Trigger useEffect when either of these dependencies change



    useEffect(() => {
        fetchCount()
        fetchData();
    }, [limit, search, currentPage, dateFilter, statusFilter, searchOrderNo]);



    const sentToCourierFun = async () => {
        for (let order of sentToCourierOrders) {
            try {

                const { data: status } = await axios.get(`${url}/status_by_invoice/${order.invoice}`, {
                    headers: {
                        'Api-Key': apiKey,
                        'Secret-Key': secretKey,
                        'Content-Type': 'application/json', // Optional: specify content type
                    },
                });

                if (status.delivery_status === "pending") {
                    handleStatusChangeForCourier(order._id, "courierProcessing");
                    console.log(status.delivery_status);
                    console.log("inside send to courier");

                }
                else if (status.delivery_status === "delivered") {
                    handleStatusChangeForCourier(order._id, "delivered");
                    console.log("inside courier processing", status.delivery_status);

                }
                else if (status.delivery_status === "cancelled") {
                    handleStatusChangeForCourier(order._id, "courierReturn");
                    console.log("inside courier processing", status.delivery_status);
                }

            } catch (error) {
                console.error(`Error processing order with invoice ${order.invoice}:`, error);
            }
        }
        console.log("Sent to courier calling");
    };

    const courierProcessingFun = async () => {
        for (let order of courierProcessingOrders) {
            try {
                const { data: status } = await axios.get(`${url}/status_by_invoice/${order.invoice}`, {
                    headers: {
                        'Api-Key': apiKey,
                        'Secret-Key': secretKey,
                        'Content-Type': 'application/json', // Optional: specify content type
                    },
                });

                if (status.delivery_status === "delivered") {
                    handleStatusChangeForCourier(order._id, "delivered");
                    console.log("inside courier processing", status.delivery_status);

                } else if (status.delivery_status === "cancelled") {
                    handleStatusChangeForCourier(order._id, "courierReturn");
                    console.log("inside courier processing", status.delivery_status);
                }

            } catch (error) {
                console.error(`Error processing order with invoice ${order.invoice}:`, error);
            }
        }
        console.log("courier process calling");
    };


    const handleStatusChange = async (orderId, newStatus, item) => {
        // Optimistically update the UI
        if (newStatus === "sendToCourier") {
            return alert("Please click SteadFast Button")
        }
        // else if(newStatus === "courierProcessing"){
        //     return alert("Status Will change automatically")
        // }
        // else if(newStatus === "delivered"){
        //     return alert("Can't Change the status")
        // }

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
                return; // Add this to ensure the function stops after throwing the error
            }

            // Update the state with the confirmed data from the server
            const updatedOrder = await response.json();

            if (newStatus === "sendToCourier") {
                const data = {
                    // Your request payload
                    invoice: item?.invoice,
                    recipient_name: item?.name,
                    recipient_phone: item?.phone,
                    recipient_address: item.address,
                    cod_amount: item.grandTotal,
                };

                axios.post(`${url}/create_order`, data, {
                    headers: {
                        'Api-Key': apiKey,
                        'Secret-Key': secretKey,
                        'Content-Type': 'application/json', // Optional: specify content type
                    },
                })
                    .then((response) => {
                        console.log('Success:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }

            // Optionally, show a success message
            alert('Order status updated successfully');
            fetchData()
            fetchCount()

        } catch (error) {
            // Rollback the UI if there's an error
            setOrders(previousOrders);
            console.error(error);
            alert(error.message || 'An error occurred while updating the order status');
        }
    };


    const handleStatusChangeForCourier = async (orderId, newStatus, item) => {
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
                return; // Add this to ensure the function stops after throwing the error
            }
            if (newStatus === "sendToCourier") {
                const data = {
                    // Your request payload
                    invoice: item?.invoice,
                    recipient_name: item?.name,
                    recipient_phone: item?.phone,
                    recipient_address: item.address,
                    cod_amount: item.grandTotal,
                };

                axios.post(`${url}/create_order`, data, {
                    headers: {
                        'Api-Key': apiKey,
                        'Secret-Key': secretKey,
                        'Content-Type': 'application/json', // Optional: specify content type
                    },
                })
                    .then((response) => {
                        console.log('Success:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }

            // Update the state with the confirmed data from the server
            const updatedOrder = await response.json();
            fetchCount()
            fetchData();

        } catch (error) {
            // Rollback the UI if there's an error
            setOrders(previousOrders);
            console.error(error);
            alert(error.message || 'An error occurred while updating the order status');
        }
    };


    const handleFilterByStatus = (status) => {
        setStatusFilter(status);
        setCurrentPage(1)
    };

    const handleFilterByCourier = (courier) => {
        setCourierFilter(courier);
        setCurrentPage(1)
    };

    const handleFilterByDate = (date) => {
        setDateFilter(date);
        setCurrentPage(1)
    };


    const updatePrint = id => {
        axios.put(`${baseUrl}/api/orders/update-print/${id}`)
            .then(res => {

            })
    }





    return (
        <React.Fragment>
            <style>
                {
                    `
                    .deliver{
                        background-color: #6EC207 !important;
                        color: white !important;
                    }
                    .sent-to-courier{
                        background-color: #4F75FF !important;
                        color: white !important;

                    }
                    `
                }
            </style>
            <div className="mt-20 mb-20">
                <Container>
                    {/* Status Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#ff7e3e1d]" onClick={() => handleFilterByStatus('new')}>
                            <p className="text-2xl font-bold text-[#FF7F3E]">{orderObject?.new_orders}</p>
                            <p className="font-semibold text-[#FF7F3E]">New Order</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#af47d223]" onClick={() => handleFilterByStatus('pending')}>
                            <p className="text-2xl font-bold text-[#AF47D2]">{orderObject?.pending}</p>
                            <p className="font-semibold text-[#AF47D2]">Pending</p>
                        </div>



                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#1b424225]" onClick={() => handleFilterByStatus('pendingPayment')}>
                            <p className="text-2xl font-bold text-[#1B4242]">{orderObject?.pendingPayment}</p>
                            <p className="font-semibold text-[#1B4242]">Pending Payment</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#40a57821]" onClick={() => handleFilterByStatus('confirm')}>
                            <p className="text-2xl font-bold text-[#40A578]">{orderObject?.confirm}</p>
                            <p className="font-semibold text-[#40A578]">Confirm</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#ff204d2a]" onClick={() => handleFilterByStatus('hold')}>
                            <p className="text-2xl font-bold text-[#FF204E]">{orderObject?.hold}</p>
                            <p className="font-semibold text-[#FF204E]">Hold</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#ff3ea523]" onClick={() => handleFilterByStatus('processing')}>
                            <p className="text-2xl font-bold text-[#FF3EA5]">{orderObject?.processing}</p>
                            <p className="font-semibold text-[#FF3EA5]">Processing</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#620c9f21]" onClick={() => handleFilterByStatus('sendToCourier')}>
                            <p className="text-2xl font-bold text-[#610C9F]">{orderObject?.sendToCourier}</p>
                            <p className="font-semibold text-[#610C9F]">Sent to Courier</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#fa58b616]" onClick={() => handleFilterByStatus('courierProcessing')}>
                            <p className="text-2xl font-bold text-[#FA58B6]">{orderObject?.courierProcessing}</p>
                            <p className="font-semibold text-[#FA58B6]">Courier Processing</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#4dc57b2d]" onClick={() => handleFilterByStatus('delivered')}>
                            <p className="text-2xl font-bold text-[#4dc57b]">{orderObject?.delivered}</p>
                            <p className="font-semibold text-[#4dc57b]">Delivered</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('partialReturn')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{orderObject?.partialReturn}</p>
                            <p className="font-semibold text-[#8B9A46]">Partial Return</p>
                        </div>
                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#87c83127]" onClick={() => handleFilterByStatus('returnWithDeliveryCharge')}>
                            <p className="text-2xl font-bold text-[#87c831]">{orderObject?.returnWithDeliveryCharge}</p>
                            <p className="font-semibold text-[#87c831]">Return With Delivery Charge</p>
                        </div>
                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#c84a312a]" onClick={() => handleFilterByStatus('return')}>
                            <p className="text-2xl font-bold text-[#C84B31]">{orderObject?.return_delivery}</p>
                            <p className="font-semibold text-[#C84B31]">Return</p>
                        </div>


                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#8b9a4619]" onClick={() => handleFilterByStatus('exchange')}>
                            <p className="text-2xl font-bold text-[#8B9A46]">{orderObject?.exchange}</p>
                            <p className="font-semibold text-[#8B9A46]">Exchange</p>
                        </div>

                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#d5535320]" onClick={() => handleFilterByStatus('cancel')}>
                            <p className="text-2xl font-bold text-[#d55353]">{orderObject?.cancel}</p>
                            <p className="font-semibold text-[#d55353]">Cancel</p>
                        </div>
                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#46829a2c]" onClick={() => handleFilterByStatus('doubleOrderCancel')}>
                            <p className="text-2xl font-bold text-[#46829a]">{orderObject?.doubleOrderCancel}</p>
                            <p className="font-semibold text-[#46829a]">Double Order Cancel</p>
                        </div>
                        <div className="shadow-md cursor-pointer text-center py-2 bg-[#9a466920]" onClick={() => handleFilterByStatus('courierReturn')}>
                            <p className="text-2xl font-bold text-[#9a4669]">{orderObject?.courierReturn}</p>
                            <p className="font-semibold text-[#9a4669]">Courier Return</p>
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
                                    <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                    <option value="exchange">Exchange</option>
                                    <option value="cancel">Cancel</option>
                                    <option value="doubleOrderCancel">Double Order Cancel</option>
                                    <option value="courierReturn">Courier Return</option>
                                </select>

                                <select
                                    className="select select-bordered"
                                    value={courierFilter}
                                    onChange={(e) => handleFilterByCourier(e.target.value)}
                                >
                                    <option disabled value="">Filter By Courier</option>
                                    <option value="user1">Stead Fast</option>
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
                                placeholder="Invoice No or Phone"
                                className="input input-bordered w-full max-w-56"
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                            />

                            <input
                                type="text"
                                placeholder="Order No"
                                className="input input-bordered max-w-28"
                                onChange={(e) => { setSearchOrderNo(e.target.value); setCurrentPage(1) }}
                            />



                            <div className="flex gap-6 md:mr-4">
                                <Link to={'/pos-orders'} className="btn btn-sm bg-error text-white border-none">
                                    <span>
                                        <IoIosAddCircle className="text-xl" />
                                    </span>
                                    Pos Order
                                </Link>
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
                                                onChange={(e) => { setLimit(e.target.value); setCurrentPage(1) }}
                                                name="" id="" className='w-12'>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="150">150</option>
                                            </select>

                                        </div>
                                        {
                                            loading ? <div className="mx-auto flex gap-4">
                                                <span className="loading loading-bars loading-xs"></span>
                                                <span className="loading loading-bars loading-sm"></span>
                                                <span className="loading loading-bars loading-md"></span>
                                                <span className="loading loading-bars loading-lg"></span>
                                            </div>
                                                :
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
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orders?.map((item, index) => (
                                                                <tr key={item._id}>
                                                                    <td className="border-2 border-gray-100">{index + 1}</td>
                                                                    <td className="border-2 border-gray-100">
                                                                        <div className="space-y-1">
                                                                            <p className="font-bold">
                                                                                {`${('0' + new Date(item.createdAt).getDate()).slice(-2)}-${('0' + (new Date(item.createdAt).getMonth() + 1)).slice(-2)}-${new Date(item.createdAt).getFullYear().toString().slice(-2)}, ${new Date(item.createdAt).getHours() % 12 || 12}:${('0' + new Date(item.createdAt).getMinutes()).slice(-2)} ${new Date(item.createdAt).getHours() >= 12 ? 'PM' : 'AM'}`}
                                                                            </p>
                                                                            <p className="font-bold text-error">{item.serialId}</p>
                                                                            <p className="font-bold text-success">Order No: {item?.orderNo}</p>
                                                                            <p>{item.invoice}</p>

                                                                            <p className="flex items-center gap-1">
                                                                                <span><CgProfile /></span>
                                                                                <span className="font-semibold">{item.name}</span>
                                                                            </p>
                                                                            <p className="flex items-center gap-1">
                                                                                <span><FaPhoneAlt /></span>
                                                                                <span className="font-semibold">{item.phone}</span>
                                                                            </p>
                                                                            <p className="flex gap-1 italic"><span className="">{item.address}</span></p>
                                                                            <p className="flex gap-1"><span className="font-semibold">Customer Note: </span>{item.orderNotes}</p>
                                                                            <p className="text-red-500">Admin Note: {item?.notes[item?.notes.length - 1]?.noteContent}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="border-2 border-gray-100">
                                                                        <div className="w-40">
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
                                                                                <div key={c?._id} className="shadow-md cursor-pointer rounded-md w-40 ">
                                                                                    <div className="px-2">
                                                                                        <div className="relative">
                                                                                            <img className="w-[140px] mx-auto shadow-lg" src={c?.productId?.images[0] ? `${baseUrl}/${c?.productId?.images[0]}` : altImg} alt={c?.productId?.productName} />
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
                                                                            <div className='flex'>
                                                                                <select
                                                                                    // disabled={
                                                                                    //     ['sendToCourier', 'courierProcessing', 'delivered', 'partialReturn', 'returnWithDeliveryCharge', 'return', 'exchange'].includes(
                                                                                    //         item?.status[item?.status?.length - 1]?.name
                                                                                    //     )
                                                                                    // }
                                                                                    className={`select select-bordered w-36 justify-center ${item?.status[item?.status?.length - 1]?.name === 'confirm'
                                                                                        ? 'bg-green-100 text-green-700'
                                                                                        : item?.status[item?.status?.length - 1]?.name === 'cancel' ||
                                                                                            item?.status[item?.status?.length - 1]?.name === 'doubleOrderCancel'
                                                                                            ? 'bg-red-100 text-red-700'
                                                                                            : item?.status[item?.status?.length - 1]?.name === 'processing'
                                                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                                                : item?.status[item?.status?.length - 1]?.name === 'sendToCourier'
                                                                                                    ? 'sent-to-courier'
                                                                                                    : item?.status[item?.status?.length - 1]?.name === 'delivered'
                                                                                                        ? 'deliver' // Green background for delivered status
                                                                                                        : ''
                                                                                        }`}
                                                                                    value={item?.status[item?.status?.length - 1]?.name || 'new'}
                                                                                    onChange={(e) => handleStatusChange(item?._id, e.target.value, item)}
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
                                                                                    <option value="partialReturn">Partial Return</option>
                                                                                    <option value="returnWithDeliveryCharge">Return with Delivery Charge</option>
                                                                                    <option value="return">Return</option>
                                                                                    <option value="exchange">Exchange</option>
                                                                                    <option value="cancel">Cancel</option>
                                                                                    <option value="doubleOrderCancel">Double Order Cancel</option>
                                                                                    <option value="courierReturn">Courier Return</option>
                                                                                </select>
                                                                            </div>

                                                                            <div>
                                                                                <div className="flex gap-2 ">
                                                                                    <button
                                                                                        className={`btn btn-sm ${["confirm", "hold", "processing"].includes(item?.status[item?.status.length - 1]?.name) ? 'bg-sky-500 text-white' : 'bg-gray-300 text-gray-500 disabled'}`}
                                                                                        onClick={() => {
                                                                                            handleStatusChangeForCourier(item?._id, "sendToCourier", item);
                                                                                        }}
                                                                                    >
                                                                                        Stead Fast
                                                                                    </button>

                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="border-2 border-gray-100">
                                                                        <div className="space-y-3">
                                                                            <div className="text-center">
                                                                                <a onClick={() => updatePrint(item._id)} target='_blank' href={`/invoice/${item._id}`} className={`btn btn-sm text-white bg-${item.isPrint ? 'red-500' : 'green-500'}`}>
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
                                                                                <br />
                                                                                <a target='_blank' href={`/manage-orders/${item._id}`} className="btn btn-sm text-success text-xl mt-2">
                                                                                    <FaEdit />
                                                                                </a>
                                                                                <NoteModal />
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                        }
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
