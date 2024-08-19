import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";
import baseUrl from "../../../helpers/baseUrl";
import { useParams } from "react-router";

const ManageOrders = () => {
    document.title = "Estarch | Manage Order";
    const [orders, setOrders] = useState({});
    const [barcode, setBarcode] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams();
    const [barcodeProduct, setBarcodeProduct] = useState(null);
    const [product, setProduct] = useState([])
    console.log(product);
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/order/${id}`);
                setOrders(response.data);
                setProduct(orders.cartItems)
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        fetchOrder();
    }, [id]);


    const handleBarcodeChange = async (e) => {
        const barcode = e.target.value;
        setBarcode(barcode);

        if (barcode) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/search/${barcode}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                if (data) {
                   console.log(data);
               }
            } catch (error) {
                setError('Product not found');
                setBarcodeProduct(null);
            }
        } else {
            setBarcodeProduct(null);
            setError('');
        }
    };

    const [rows, setRows] = useState([
        { paymentType: "Cash", paymentOption: "Mobile", amountReceived: "" },
    ]);

    const handleAddRow = (event) => {
        event.preventDefault();
        setRows([...rows, { paymentType: "", paymentOption: "", amountReceived: "" }]);
    };

    const handleDeleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };

    const handleQuantityChange = (index, delta) => {
        setOrders(prevOrders => {
            const updatedCartItems = [...prevOrders.cartItems];
            updatedCartItems[index].quantity = Math.max(updatedCartItems[index].quantity + delta, 1); // Ensure quantity is at least 1
            return { ...prevOrders, cartItems: updatedCartItems };
        });
    };

    const handleRemoveProduct = (index) => {
        setOrders(prevOrders => ({
            ...prevOrders,
            cartItems: prevOrders.cartItems.filter((_, i) => i !== index)
        }));
    };
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
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders?.name || ''}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders?.phone || ''}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Address</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders?.address || ''}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Note</label>
                                <textarea
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders?.orderNotes || ''}
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
                                    type="date"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue={orders.timestamp ? new Date(orders.timestamp).toISOString().split('T')[0] : ''}
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

                                    {error && <p className="text-red-500 mt-2">{error}</p>}

                                    {barcodeProduct && (
                                        <div className="mt-4 p-4 border-2 rounded flex items-center gap-4">
                                            {barcodeProduct.images && barcodeProduct.images.length > 0 && (
                                                <img
                                                    src={barcodeProduct.images[0]}
                                                    alt={barcodeProduct.productName}
                                                    className="h-24 w-24 object-cover"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <h2 className="text-lg font-medium">{barcodeProduct.productName}</h2>
                                                {barcodeProduct.sizeDetails && barcodeProduct.sizeDetails.length > 0 && (
                                                    <p><strong>Size:</strong> {barcodeProduct.sizeDetails[0].size}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Table and other form fields */}
                                <div className="overflow-x-auto border-2">
                                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-600 text-white">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">SKU</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Product</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Quantity</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Price</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Discount</th>
                                                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product?.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td className="border-b p-2">{product.SKU}</td>
                                                    <td className="border-b p-2">{product.title}<span>({product.size})</span></td>
                                                    <td className="border-b p-2 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                className="bg-gray-200 px-2"
                                                                onClick={() => handleQuantityChange(index, -1)}
                                                            >-</button>
                                                            <span className="mx-2">{product.quantity}</span>
                                                            <button
                                                                type="button"
                                                                className="bg-gray-200 px-2"
                                                                onClick={() => handleQuantityChange(index, 1)}
                                                            >+</button>
                                                        </div>
                                                    </td>
                                                    <td className="border-b p-2 text-center">{product.price}</td>
                                                    <td className="border-b p-2 text-center">{product.discount}</td>
                                                    <td className="border-b p-2 text-center">
                                                        <button onClick={() => handleRemoveProduct(index)}>
                                                            <MdDelete className="text-red-500 cursor-pointer" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                         
                                        </tbody>
                                    </table>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ref. No</label>
                                        <input type="text" className="w-full p-2 border-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Order Source</label>
                                        <select className="w-full p-2 border-2 rounded">
                                            <option value="Software">{orders.serialId}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Sub Total</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border-2 rounded bg-gray-100"
                                            value={orders.totalAmount || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Discount</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border-2 rounded"
                                            defaultValue={orders.discount || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Delivery Charge</label>
                                        <input
                                            type="text"
                                            defaultValue={orders?.deliveryCharge || ''}
                                            className="w-full p-2 border-2 rounded"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border-2 rounded bg-gray-100"
                                        value={orders.grandTotal || ''}
                                        readOnly
                                    />
                                </div>
                                <div className="overflow-x-auto border-2">
                                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-600 text-white">
                                            <tr>
                                                <th className="border text-xs border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                                    Payment Type
                                                </th>
                                                <th className="border text-xs border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                                    Payment Option
                                                </th>
                                                <th className="border text-xs border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                                    Amount Received
                                                </th>
                                                <th className="border text-xs border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-2 py-2">
                                                        <select
                                                            name="paymentType"
                                                            value={row.paymentType}
                                                            onChange={(e) => handleInputChange(index, e)}
                                                            className="w-full p-2 border-2 rounded"
                                                        >
                                                            <option value="Cash">Cash</option>
                                                            <option value="Card">Card</option>
                                                            <option value="Bank Transfer">Bank Transfer</option>
                                                        </select>
                                                    </td>
                                                    <td className="border border-gray-300 px-2 py-2">
                                                        <select
                                                            name="paymentOption"
                                                            value={row.paymentOption}
                                                            onChange={(e) => handleInputChange(index, e)}
                                                            className="w-full p-2 border-2 rounded"
                                                        >
                                                            <option value="Mobile">Mobile</option>
                                                            <option value="Internet Banking">Internet Banking</option>
                                                            <option value="PayPal">PayPal</option>
                                                        </select>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="amountReceived"
                                                            value={row.amountReceived}
                                                            onChange={(e) => handleInputChange(index, e)}
                                                            className="w-full p-2 border-2 rounded"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center flex gap-1 justify-center">
                                                        <button
                                                            onClick={() => handleDeleteRow(index)}
                                                            className="bg-red-500 text-white px-2 py-2 rounded"
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            onClick={handleAddRow}
                                                            className="bg-blue-500 text-white px-2 py-2 rounded"
                                                        >
                                                            <IoMdAddCircle />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Paid Amount</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border-2 rounded bg-gray-100"
                                            value="2900"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Due Amount</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border-2 rounded bg-gray-100"
                                            value="2900"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex justify-center items-center my-4">
                        <button className="btn btn-wide">Update</button>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageOrders;
