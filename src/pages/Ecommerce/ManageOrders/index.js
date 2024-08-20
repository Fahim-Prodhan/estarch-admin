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
    const [barcodeProduct, setBarcodeProduct] = useState(null);
    const [products, setProducts] = useState([]); // Renamed to products for clarity
    const [delivery, setDelevary] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [Advance, setAdvance] = useState(0)
    const [adminDiscount, setAdminDiscount] = useState(0)
    const { id } = useParams();
    console.log(orders);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/orders/order/${id}`);
                setOrders(response.data);
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
        console.log(updateDiscount);
        axios.patch(`${baseUrl}/api/orders/manage-order/${id}`, { cartItems: products, advanced: Advance, discount: updateDiscount, totalAmount: calculateTotalAmount(), grandTotal: totalAmount(), dueAmount: dueAmount() })
            .then(res => {
                alert("ok")
            })
    }

    const handleBarcodeChange = async (e) => {
        const barcode = e.target.value;
        setBarcode(barcode);

        if (barcode.length === 7) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/product/barcode/${barcode}`);
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
        setAdvance(orders?.advanced)
    }, [orders]);

    console.log(discount);
    console.log(products)


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
                                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">SKU</th>
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
                                                        <td className="border-b p-2">{product.productId.SKU}</td>
                                                        <td className="border-b p-2">{product.title}<span>({product.size})</span></td>
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
