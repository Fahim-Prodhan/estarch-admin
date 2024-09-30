import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import baseUrl from "../../../helpers/baseUrl";
import { useParams } from "react-router";
import { PiPlus } from 'react-icons/pi';
import { TbTrash } from 'react-icons/tb';
const ManageOrders = () => {
    document.title = "Estarch | Manage Order";
    const [orders, setOrders] = useState({});
    const [barcode, setBarcode] = useState('');
    const [error, setError] = useState('');
    const [barcodeProduct, setBarcodeProduct] = useState(null);
    const [products, setProducts] = useState([]); // Renamed to products for clarity
    const [delivery, setDelevary] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [Advance, setAdvance] = useState(0)
    const [adminDiscount, setAdminDiscount] = useState(0)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [orderNotes, setOrderNotes] = useState('')
    const [payments, setPayments] = useState([
        { id: 1, accountType: '', paymentOption: '', amount: '', paymentOptions: [] },
    ]);

    const [newPayments, setNewPayments] = useState([]); // Store newly added payments
    const [accounts, setAccounts] = useState([]); // Store the accounts data

    // Fetch accounts data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/payment/online-accounts');
                const data = await response.json();
                if (data && data.length > 0) {
                    setAccounts(data[0].accounts); // Assuming "accounts" is inside the first object
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchData();
    }, []);

    const handleAccountTypeChange = (id, value, isNew = false) => {
        const selectedAccount = accounts.find((acc) => acc.accountType === value);
        const paymentOptions = selectedAccount ? selectedAccount.payments : [];

        const updateState = (state, setState) => {
            setState((prevPayments) =>
                prevPayments.map((payment) =>
                    payment.id === id
                        ? { ...payment, accountType: value, paymentOption: '', accountNumber: '', paymentOptions } // Reset paymentOption and set new options
                        : payment
                )
            );
        };
        updateState(newPayments, setNewPayments);
        updateState(payments, setPayments);
    };

    const addPaymentRow = () => {
        const newPayment = { id: Date.now(), accountType: '', paymentOption: '', amount: '', paymentOptions: [] };
        setNewPayments([...newPayments, newPayment]); // Add to newPayments state
        setPayments([...payments, newPayment]); // Also add to payments state
    };

    const removePaymentRow = (id, isNew = false) => {
        if (isNew) {
            setNewPayments(newPayments.filter((payment) => payment.id !== id));
        } else {
            setPayments(payments.filter((payment) => payment.id !== id));
        }
    };

    const handleInputChange = (id, field, value, isNew = false) => {
        const updateState = (state, setState) => {
            setState((prevPayments) =>
                prevPayments.map((payment) => {
                    if (payment.id === id) {
                        if (field === 'paymentOption') {
                            const selectedAccount = accounts.find((acc) => acc.accountType === payment.accountType);
                            const selectedPaymentOption = selectedAccount?.payments.find((opt) => opt.paymentOption === value);
                            const accountNumber = selectedPaymentOption?.accountNumber || '';

                            return { ...payment, paymentOption: value, accountNumber };
                        }
                        return { ...payment, [field]: value };
                    }
                    return payment;
                })
            );
        };


        updateState(newPayments, setNewPayments);

        updateState(payments, setPayments);

    };

    // Calculate total amount for payments and new payments
    const totalPayAmount = payments.reduce(
        (acc, payment) => acc + Number(payment.amount || 0),
        0
    );
    console.log(newPayments);
    console.log(payments);


    const totalNewPayAmount = newPayments.reduce(
        (acc, payment) => acc + Number(payment.amount || 0),
        0
    );

    console.log(totalNewPayAmount);




    const { id } = useParams();
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/order/${id}`);
                setOrders(response.data);
                setPayments(response.data.payments)
                console.log(response.data);

                setProducts(response.data.cartItems || []);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        fetchOrder();
    }, [id]);
    const updateDiscount = discount + parseInt(adminDiscount)
    // Update order
    const UpdateOrder = () => {
        const userIdString = localStorage.getItem('userId');
        const userId = JSON.parse(userIdString);
        console.log(updateDiscount);
        axios.patch(`${baseUrl}/api/orders/manage-order/${id}`, { manager: userId, newPayments, payments, name, address, phone, orderNotes, deliveryCharge: delivery, cartItems: products, advanced: Advance, discount: calculateTotalDiscount(), adminDiscount: parseInt(adminDiscount), totalAmount: calculateTotalAmount(), grandTotal: totalAmount(), dueAmount: dueAmount() })
            .then(res => {
                alert("ok")
                console.log(res);
            })
    }
    const handleBarcodeChange = async (e) => {
        const barcode = e.target.value;
        setBarcode(barcode);

        if (barcode.length === 7) {
            try {
                const response = await fetch(`${baseUrl}/api/products/product/barcode/${barcode}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                if (data) {
                    setProducts([...products, data]);
                }
            } catch (error) {
                setError('Product not found');
                setBarcodeProduct(null);
            }
        } else {
            setBarcodeProduct(null);
            setError('');
        }
        console.log(products);
    };

    const handleQuantityChange = (index, delta) => {
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].quantity = Math.max(updatedProducts[index].quantity + delta, 1); // Ensure quantity is at least 1
            return updatedProducts;
        });
    };

    const handleRemoveProduct = (index) => {
        setProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
    };



    const calculateTotalAmount = () => products.reduce((total, item) => total + item.price * item.quantity, 0);
    const calculateTotalDiscount = () => products.reduce((total, item) => total + item.discountAmount * item.quantity, 0);

    const totalAmount = () => {
        return (calculateTotalAmount() + parseInt(delivery)) - adminDiscount;
    };

    const dueAmount = () => {
        return totalAmount() - Advance
    }



    useEffect(() => {
        setDelevary(orders?.deliveryCharge)
        const totalDiscount = products.reduce((accumulator, item) => {
            return accumulator + (item.discountAmount * item.quantity || 0);
        }, 0);
        setDiscount(totalDiscount)
        setAdvance(totalPayAmount)
        setAdminDiscount(orders?.adminDiscount)
        setOrderNotes(orders?.orderNotes || '')
        setPhone(orders?.phone || '')
        setAddress(orders?.address || '')
        setName(orders?.name || '')
    }, [orders, payments]);
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Manage Order" />

                    <div className="grid md:grid-cols-2 gap-2">
                        <div className="p-4 border-2 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Customer Info</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={name}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Phone</label>
                                <input
                                    type="text"
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={phone}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Address</label>
                                <input
                                    type="text"
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={address}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Note</label>
                                <textarea
                                    className="w-full px-3 py-2 border-2 rounded"
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    defaultValue={orderNotes}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Courier Name</label>
                                <select className="w-full px-3 py-2 border-2 rounded">
                                    <option>Select Courier</option>
                                    <option>SteadFast</option>
                                    <option>Pathao</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Order Date</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders.createdAt}
                                />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-semibold mb-4">Product Info</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select Product (by barcode)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border-2 rounded mb-2"
                                        value={barcode}
                                        onChange={handleBarcodeChange}
                                        placeholder="Enter barcode..."
                                    />
                                </div>

                                <div className="overflow-x-auto border-2">
                                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-600 text-white">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">SKU & Barcode</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Product</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Quantity</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Discount</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Total</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length > 0 ?
                                                products.map((product, index) => (
                                                    <tr key={product.id}>
                                                        <td className="border-b p-2"><span>SKU: {product.productId.SKU}</span> {product.productId.sizeDetails.map((p, index) => (
                                                            p.size === product.size ? <p> Barcode: {p.barcode}  </p> : null))}</td>
                                                         <td className="border-b p-2">{product.title} <span>(Size: {product.size})</span> {product.productId.sizeDetails.map((p, index)=>(
                                                            p.size === product.size ? <span className="text-red-500">Available: {p.openingStock} </span> : null
                                                        ))}</td>

                                                        <td className="border-b p-2 text-center">
                                                            <div className="flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    className="bg-gray-200 px-2"
                                                                    onClick={() => handleQuantityChange(index, -1)}
                                                                    disabled={product.quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="mx-2">{product.quantity}</span>
                                                                <button
                                                                    type="button"
                                                                    className="bg-gray-200 px-2"
                                                                    onClick={() => handleQuantityChange(index, 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="border-b p-2 text-center">{product.quantity * product?.discountAmount}</td>
                                                        <td className="border-b p-2 text-center">{product.quantity * product.price}</td>
                                                        <td className="border-b p-2 text-center">
                                                            <button
                                                                type="button"
                                                                className="text-red-500"
                                                                onClick={() => handleRemoveProduct(index)}
                                                            >
                                                                <MdDelete size={24} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan="6" className="text-center p-4">No products found</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sub Total</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border-2 rounded bg-gray-100"
                                        value={calculateTotalAmount() || ''}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Admin Discount</label>
                                    <input
                                        type="number"
                                        onChange={(e) => setAdminDiscount(e.target.value)}
                                        className="w-full p-2 border-2 rounded"
                                        value={adminDiscount}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Delivery Charge</label>
                                    <input
                                        type="number"
                                        Value={delivery}
                                        onChange={(e) => setDelevary(e.target.value)}
                                        className="w-full p-2 border-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Total</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border-2 rounded bg-gray-100"
                                        value={totalAmount()}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Advance</label>
                                    <input
                                        type="text"
                                        value={Advance}
                                        onChange={(e) => setAdvance(e.target.value)}
                                        className="w-full p-2 border-2 rounded"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Due Amount</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border-2 rounded bg-gray-100"
                                            value={dueAmount()}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='max-h-40 overflow-y-scroll mt-5 w-full'>
                                {payments?.map((payment) => (
                                    <div className="grid grid-cols-5 gap-4 mb-2" key={payment.id}>
                                        {/* Payment Type */}
                                        <div className="col-span-1">
                                            <select
                                                className="w-full p-2 border rounded"
                                                value={payment.accountType}
                                                onChange={(e) => handleAccountTypeChange(payment.id, e.target.value)}
                                            >
                                                <option value="">Select Account Type</option>
                                                {accounts.map((account) => (
                                                    <option key={account._id} value={account.accountType}>
                                                        {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Payment Option */}
                                        <div className="col-span-1">
                                            <select
                                                className="w-full p-2 border rounded"
                                                value={payment.paymentOption}
                                                onChange={(e) => handleInputChange(payment.id, 'paymentOption', e.target.value)}
                                            >
                                                <option value="">Account option</option>
                                                {payment?.paymentOptions?.map(option => (
                                                    <option key={option._id} value={option.paymentOption}>
                                                        {option.paymentOption}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-span-1">
                                            <input
                                                type="text"
                                                disabled
                                                placeholder="accountNumber"
                                                value={payment.accountNumber}
                                                onChange={(e) => handleInputChange(payment.id, 'accountNumber', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={payment.amount}
                                                onChange={(e) => handleInputChange(payment.id, 'amount', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="col-span-1 flex items-center space-x-2">
                                            <button className="text-blue-500 p-2" onClick={addPaymentRow}>
                                                <PiPlus />
                                            </button>
                                            {payments.length > 1 && (
                                                <button
                                                    className="text-red-500 p-2"
                                                    onClick={() => removePaymentRow(payment.id)}
                                                >
                                                    <TbTrash />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button onClick={() => UpdateOrder()} className="btn btn-sm my-3 btn-error text-white">Update</button>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageOrders;
