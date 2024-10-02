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
    const [assets, setAssets] = useState([]);
    const [purchaseItems, setPurchaseItems] = useState([]);
    const [reference, setReference] = useState('');
    const [note, setNote] = useState('');
    const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now()}`);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/product-asset`);
                const data = await response.json();
                setAssets(data);
            } catch (error) {
                console.error('Error fetching assets:', error);
            }
        };
        fetchAssets();
    }, []);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/suppliers?type=Product Asset`);
                setSuppliers(response.data);
                if (response.data.length > 0) {
                    setSelectedSupplier(response.data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleSaveSupplier = async () => {
        // Save supplier logic
    };

    const addPurchaseItem = (asset) => {
        const existingItem = purchaseItems.find(item => item.assetName === asset.assetName);
        if (existingItem) {
            // If item already exists, just increase the quantity
            setPurchaseItems(purchaseItems.map(item => 
                item.assetName === asset.assetName 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            // Add new item
            setPurchaseItems([...purchaseItems, { ...asset, quantity: 1 }]);
        }
    };

    const deletePurchaseItem = (assetName) => {
        setPurchaseItems(purchaseItems.filter(item => item.assetName !== assetName));
    };

    const totalAmount = purchaseItems.reduce((total, item) => total + (item.perItemPrice * item.quantity), 0);
    const due = totalAmount; // Update this based on your logic

    const handleBuy = async () => {
        const purchaseData = {
            supplier: selectedSupplier, // Make sure this is an ObjectId if required
            invoiceNo,
            reference,
            note,
            purchaseDate: new Date().toISOString(),
            items: purchaseItems.map(item => ({
                asset: item._id, // Assuming this is the asset's ObjectId
                quantity: item.quantity,
                purchasePrice: item.perItemPrice,
                subtotal: item.perItemPrice * item.quantity,
                total: item.perItemPrice * item.quantity, // Adjust if total needs to be calculated differently
             
            })),
            totalAmount,
            totalQuantity: purchaseItems.reduce((total, item) => total + item.quantity, 0), // Calculate total quantity
            due // Set your due amount calculation logic here
        };
    
        try {
            const response = await axios.post(`${baseUrl}/api/purchase/create-asset-purchase`, purchaseData);
            console.log('Purchase successful:', response.data);
            setPurchaseItems([]); // Clear purchase items after success
            setReference(''); // Reset fields as needed
            setNote('');
        } catch (error) {
            console.error('Error during purchase:', error);
        }
    };
    

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Type" />
                    <div className="p-6 bg-gray-100 min-h-screen">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Purchase Asset</h2>
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
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Invoice No</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded"
                                        value={invoiceNo}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Purchase Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 p-2 border rounded"
                                        value={new Date().toISOString().slice(0, 10)} // current date
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
                                        className="w-full mt-1 p-2 border rounded"
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
                            <div>
                                <label className="block text-gray-700">Select Asset</label>
                                <select
                                    className="w-full mt-1 p-2 border rounded border-grey"
                                    onChange={(e) => {
                                        const asset = assets.find(a => a.assetName === e.target.value);
                                        if (asset) addPurchaseItem(asset);
                                    }}
                                >
                                    <option value="">Select an asset</option>
                                    {assets.map((asset) => (
                                        <option key={asset._id} value={asset.assetName}>
                                            {asset.assetName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <table className="w-full mt-4 border-collapse">
                                <thead>
                                    <tr className="bg-green-500 text-white">
                                        <th className="p-2 border text-center">SL No</th>
                                        <th className="p-2 border text-center">Asset Name</th>
                                        <th className="p-2 border text-center">Quantity</th>
                                        <th className="p-2 border text-center">Purchase Price</th>
                                        <th className="p-2 border text-center">Subtotal</th>
                                        <th className="p-2 border text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseItems.map((item, index) => (
                                        <tr key={item.assetName}>
                                            <td className="p-2 border text-center">{index + 1}</td>
                                            <td className="p-2 border text-center">{item.assetName}</td>
                                            <td className="p-2 border text-center">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => 
                                                        setPurchaseItems(purchaseItems.map(i => 
                                                            i.assetName === item.assetName ? { ...i, quantity: Number(e.target.value) } : i
                                                        ))
                                                    }
                                                    min="1"
                                                    className="w-16 p-1 border-t border-b text-center"
                                                />
                                            </td>
                                            <td className="p-2 border text-center">
                                                <input
                                                    type="number"
                                                    value={item.perItemPrice}
                                                    onChange={(e) => 
                                                        setPurchaseItems(purchaseItems.map(i => 
                                                            i.assetName === item.assetName ? { ...i, perItemPrice: Number(e.target.value) } : i
                                                        ))
                                                    }
                                                    min="1"
                                                    className="w-16 p-1 border-t border-b text-center"
                                                />
                                            </td>
                                            <td className="p-2 border text-center">{(item.perItemPrice * item.quantity).toFixed(2)}</td>
                                            <td className="p-2 border text-center">
                                                <button 
                                                    className="p-2 bg-red-500 text-white rounded"
                                                    onClick={() => deletePurchaseItem(item.assetName)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="p-2 border text-center" colSpan="4">Total Amount</td>
                                        <td className="p-2 border text-center">{totalAmount.toFixed(2)}</td>
                                        <td className="p-2 border text-center"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button 
                                className="p-2 bg-blue-500 text-white rounded"
                                onClick={handleBuy}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddPurchase;
