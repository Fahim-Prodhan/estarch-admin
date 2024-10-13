import { Breadcrumbs } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Modal from '../../../components/Common/Modal';
import baseUrl from '../../../helpers/baseUrl';

const AddPurchase = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [skuproduct, setSkuProduct] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [productValue, setProductValue] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [due, setDue] = useState(0);
    const [barcode, setBarcode] = useState('');
    const [products, setProducts] = useState([]);
    const [isMultiple, setIsMultiple] = useState(false);
    const [isAdding, setIsAdding] = useState(true);
    const [reference, setReference] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/products/status-on-products`);
                const data = await response.json();
                setSkuProduct(data);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on the input value
    useEffect(() => {
        if (productValue) {
            const filtered = skuproduct.filter(product =>
                product.productName.toLowerCase().includes(productValue.toLowerCase()) ||
                product.SKU.toLowerCase().includes(productValue.toLowerCase())
            );
            console.log(filtered);

            setFilteredProduct(filtered);
        } else {
            setFilteredProduct([]);
        }
    }, [productValue, skuproduct]);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        businessName: '',
        email: '',
        mobile: '',
        area: '',
        address: '',
        purchaseTotal: '',
        date: '',
        note: ''
    });
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/suppliers?type=Product`);
                setSuppliers(response.data);
                if (response.data.length > 0) {
                    setSelectedSupplier(response.data[0].name);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);
    const handleSaveSupplier = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/suppliers`, newSupplier);
            setSuppliers([...suppliers, response.data]);
            setModalOpen(false);
            setNewSupplier({
                name: '',
                businessName: '',
                email: '',
                mobile: '',
                area: '',
                address: '',
                purchaseTotal: '',
                date: '',
                note: ''
            });
        } catch (error) {
            console.error('Error saving supplier:', error);
        }
    };

    useEffect(() => {
        const fetchProductByBarcode = async (barcode) => {
            try {
                const response = await fetch(`${baseUrl}/api/products/product/barcode/${barcode}`);
                const data = await response.json();

                if (data && data.productId) {
                    const sizeDetail = data.productId.sizeDetails.find(detail => detail.barcode === barcode);
                    const newProduct = {
                        ...data.productId,
                        sizeDetail,
                        quantity: data.quantity || 1,
                        purchasePrice: sizeDetail ? sizeDetail.purchasePrice : 0,
                        subtotal: (sizeDetail ? sizeDetail.purchasePrice : 0) * (data.quantity || 1),
                        total: (sizeDetail ? sizeDetail.salePrice : 0) * (data.quantity || 1),
                    };

                    // If adding multiple products
                    if (isMultiple) {
                        setProducts(prevProducts => {
                            // Check if the product already exists
                            const existingProductIndex = prevProducts.findIndex(product => product.SKU === newProduct.SKU);
                            if (existingProductIndex >= 0) {
                                const updatedProducts = [...prevProducts];
                                updatedProducts[existingProductIndex] = newProduct; // Update the existing product
                                return updatedProducts;
                            } else {
                                return [...prevProducts, newProduct];
                            }
                        });
                    } else {
                        // Single product mode
                        if (!products.some(product => product.SKU === newProduct.SKU)) {
                            setProducts(prevProducts => [...prevProducts, newProduct]);
                        }
                        setBarcode(''); // Clear the barcode input
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        if (barcode.trim() && isAdding) {
            fetchProductByBarcode(barcode.trim());
        }
    }, [barcode, isAdding, isMultiple]);

    const clickProduct = (product) => {
        if (!product || !product.sizeDetails || product.sizeDetails.length === 0) return;

        const newProducts = product.sizeDetails.map(sizeDetail => ({
            ...product,
            sizeDetail, // Keep the individual size detail
            size: sizeDetail.size, // Add the size info
            quantity: 1, // Default quantity for each size, you can adjust this
            purchasePrice: sizeDetail.purchasePrice || 0,
            subtotal: sizeDetail.purchasePrice * 1, // Default subtotal with quantity 1
            total: sizeDetail.salePrice * 1, // Default total with sale price and quantity 1
        }));

        // Add these new products to the state
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
    };

    const handleInputChange = (e) => {
        setBarcode(e.target.value);
    };

    const handleCheckboxChange = () => {
        setIsMultiple(prev => !prev);
        if (!isMultiple) {
            setIsAdding(true);
            setBarcode('');
        } else {
            setIsAdding(false);
        }
    };

    const handleFinalize = () => {
        setIsAdding(false);
        setIsMultiple(false);
    };

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        setProducts(products.map((product, i) => i === index ? {
            ...product,
            quantity: newQuantity,
            subtotal: newQuantity * product.purchasePrice,
            total: newQuantity * product.sizeDetail.salePrice,
        } : product));
    };
    const handlePurchasePriceChange = (index, newPurchasePrice) => {
        setProducts(products.map((product, i) => i === index ? {
            ...product,
            purchasePrice: newPurchasePrice,
            subtotal: product.quantity * newPurchasePrice,
            total: product.quantity * product.sizeDetail.salePrice,
        } : product));
    };
    const handleDelete = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };
    const incrementQuantity = (index) => {
        handleQuantityChange(index, products[index].quantity + 1);
    };
    const decrementQuantity = (index) => {
        handleQuantityChange(index, products[index].quantity - 1);
    };
    const [totalQuantity, setTotalQuantity] = useState(0);
    useEffect(() => {
        const totalProductAmount = products?.reduce((sum, product) => sum + (product.subtotal || 0), 0);
        const totalProductQuantity = products?.reduce((sum, product) => sum + (product.quantity || 0), 0);
        const dueAmount = totalProductAmount;

        setDue(dueAmount);
        setTotalAmount(totalProductAmount); // Update totalAmount
        setTotalQuantity(totalProductQuantity); // Update totalQuantity
    }, [products]);


    const preparePurchaseData = () => {
        const items = products.map((product) => ({
            product: product._id,
            quantity: product.quantity,
            purchasePrice: product.purchasePrice,
            subtotal: product.subtotal,
            total: product.total,
            _id: product._id,
            barcode: product.sizeDetail?.barcode

        }));


        return {
            supplier: suppliers.find(supplier => supplier.name === selectedSupplier)._id,
            invoiceNo,
            purchaseDate: new Date().toISOString(),
            reference,
            note,
            items,
            totalAmount,
            totalQuantity,
            due,
        };
    };

    const handleBuy = async () => {
        const purchaseData = preparePurchaseData();
        try {
            const response = await axios.post(`${baseUrl}/api/purchase`, purchaseData);
            console.log('Purchase successful:', response.data);
            // Handle successful response (e.g., show a success message, reset form, etc.)
        } catch (error) {
            console.error('Error making purchase:', error);
        }
    };
    const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now()}`);
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Type" />
                    <div className="p-6 bg-gray-100 min-h-screen">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Purchase Product</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700">Supplier Name</label>
                                    <div className='flex'>
                                        <select
                                            className="w-full mt-1 p-2 border rounded border-grey"
                                            value={selectedSupplier}
                                            onChange={(e) => setSelectedSupplier(e.target.value)}
                                        >
                                            {suppliers.map((supplier) => (
                                                <option key={supplier._id} value={supplier.name}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        {/* <button
                                            className="ml-2 p-2 bg-green-500 text-white rounded"
                                            onClick={() => setModalOpen(true)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                        </button> */}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Invoice No</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded "
                                        value={invoiceNo}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Purchase Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 p-2 border rounded "
                                        value="2024-08-29"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700">Reference</label>
                                    <input
                                        type="text"
                                        placeholder="Reference"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700">Attachment</label>
                                    <input
                                        type="file"
                                        className="w-full mt-1 p-2 border rounded "
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Note</label>
                                <textarea
                                    placeholder="Note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                            <div className="flex items-center mx-48 mb-4">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    id="multiple"
                                    checked={isMultiple}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="multiple" className="text-gray-700 mr-4"></label>
                                <input
                                    type="text"
                                    placeholder="scan barcode"
                                    className="w-full p-2 border rounded"
                                    value={barcode}
                                    onChange={handleInputChange}
                                />
                                <div className='w-full'>
                                    <input value={productValue}
                                        onChange={(e) => setProductValue(e.target.value)} type="text" placeholder="Type SKU/Name" className="w-full p-2 border rounded" />
                                    {productValue && (
                                        <div className="mt-2 z-[100] h-20 overflow-y-scroll bg-white border border-gray-300 rounded shadow-md">
                                            {filteredProduct.length > 0 ? (
                                                filteredProduct.map((product, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => clickProduct(product)}
                                                        className="cursor-pointer p-2 hover:bg-gray-200 text-black"
                                                    >
                                                        {product.productName}<span>({product.SKU})</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-2 text-gray-500">No product available</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isMultiple && (
                                    <button
                                        onClick={handleFinalize}
                                        className="ml-4 p-2 bg-blue-500 text-white rounded"
                                    >
                                        Finalize
                                    </button>
                                )}
                            </div>
                            <table className="w-full mt-4 border-collapse">
                                <thead>
                                    <tr className="bg-green-500 text-white">
                                        <th className="p-2 border text-center">SL No</th>
                                        <th className="p-2 border text-center">Product Name</th>
                                        <th className="p-2 border text-center">Quantity</th>
                                        <th className="p-2 border text-center">Purchase Price</th>
                                        <th className="p-2 border text-center">Subtotal</th>
                                        <th className="p-2 border text-center">Total</th>
                                        <th className="p-2 border text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={product.SKU}>
                                            <td className="p-2 border text-center">{index + 1}</td>
                                            <td className="p-2 border text-center">
                                                {product.productName}
                                                <br />
                                                <span>Barcode: {product.sizeDetail?.barcode} ({product.sizeDetail?.size || 'N/A'})</span>
                                            </td>
                                            <td className="p-2 border text-center">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => decrementQuantity(index)}
                                                        className="p-2 bg-gray-300 text-black rounded-l"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                                        className="w-16 p-1 border-t border-b text-center"
                                                        min="1"
                                                    />
                                                    <button
                                                        onClick={() => incrementQuantity(index)}
                                                        className="p-2 bg-gray-300 text-black rounded-r"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-2 border text-center">
                                                <input
                                                    type="number"
                                                    value={product.purchasePrice}
                                                    onChange={(e) => handlePurchasePriceChange(index, Number(e.target.value))}
                                                    className="w-full p-1 border rounded"
                                                    min="0"
                                                />
                                            </td>
                                            <td className="p-2 border text-center">{product.subtotal || 0}</td>
                                            <td className="p-2 border text-center">{product.subtotal || 0}</td>
                                            <td className="p-2 border text-center">
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="p-2 bg-red-500 text-white rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="container  p-4 flex justify-end">
                            <div className="w-1/2 p-4 border rounded-lg bg-white shadow-md">
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">Total Quantity</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={totalQuantity}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">Total Amount</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={totalAmount}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block font-medium mb-1">Due</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={due}
                                        readOnly
                                    />
                                </div>
                                <button onClick={handleBuy} className="btn btn-primary w-full">Buy</button>
                            </div>
                        </div>


                    </div>
                </Container>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        title={false ? "Edit Supplier" : "Create New Supplier"}
                        onSave={handleSaveSupplier}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Name *</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.name}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Business Name</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.businessName}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, businessName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.email}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Mobile *</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.mobile}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, mobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Area</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.area}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, area: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.address}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Due</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.purchaseTotal}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, purchaseTotal: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.date}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, date: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Note</label>
                                <textarea
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.note}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, note: e.target.value })}
                                />
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </React.Fragment>
    );
};

export default AddPurchase;
