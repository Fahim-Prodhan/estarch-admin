import React, { useState, useEffect } from 'react';
import baseUrl from '../../../helpers/baseUrl';

const AddAssetModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [assets, setAssets] = useState([]);
    const [selectedAssetId, setSelectedAssetId] = useState(null);
    const [assetName, setAssetName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [perItemPrice, setPerItemPrice] = useState(0);

    // Fetch assets from the API using fetch
    const fetchAssets = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/product-asset`);
            const data = await response.json();
            setAssets(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    // Call fetchAssets on component mount
    useEffect(() => {
        fetchAssets();
    }, []);

    // Open the modal
    const openModal = () => {
        setIsOpen(true);
        setEditMode(false); // Reset edit mode
        setAssetName('');
        setQuantity(0);
        setPerItemPrice(0);
    };

    // Close the modal
    const closeModal = () => {
        setIsOpen(false);
        setAssetName('');
        setQuantity(0);
        setPerItemPrice(0);
        setSelectedAssetId(null);
    };

// Handle form submission for add or edit
const handleSubmit = async (e) => {
    e.preventDefault();
    const newAsset = {
        assetName,
        quantity: parseInt(quantity),
        perItemPrice: parseFloat(perItemPrice),
    };

    try {
        if (editMode && selectedAssetId) {
            // Edit existing asset
            const response = await fetch(`${baseUrl}/api/product-asset/${selectedAssetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAsset),
            });
            
            // Check response for editing
            if (response.ok) {
                alert("Asset updated successfully!");
            } else {
                const errorData = await response.json();
                alert("Failed to update asset: " + errorData.message);
            }
        } else {
            // Add new asset
            console.log("Creating new asset...", newAsset); // Debugging log
            const response = await fetch(`${baseUrl}/api/product-asset/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAsset),
            });
            
            const result = await response.json(); // Handle response

            // Check response for creation
            if (response.ok) {
                alert("Asset created successfully!"); // Alert after successful creation
            } else {
                alert("Failed to create asset: " + (result.message || 'Unknown error')); // Handle failed creation
            }
        }
        // Refetch assets and close modal
        await fetchAssets(); // Ensure we await this to complete before closing
        closeModal(); // Close modal after data is refetched
    } catch (error) {
        console.error('Error adding/editing asset:', error);
        alert('An error occurred while processing your request. Please try again.'); // Alert on error
    }
};

    // Handle Edit Action
    const handleEdit = (asset) => {
        setEditMode(true);
        setSelectedAssetId(asset._id);
        setAssetName(asset.assetName);
        setQuantity(asset.quantity);
        setPerItemPrice(asset.perItemPrice);
        setIsOpen(true); // Open modal with pre-filled data
    };

    return (
        <div className="container mx-auto my-24">
            {/* Add Asset Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={openModal}
            >
                Add Asset
            </button>

            {/* Asset Table */}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Asset Name</th>
                        <th className="py-2 px-4 border">Quantity</th>
                        <th className="py-2 px-4 border">Price Per Item</th>
                        <th className="py-2 px-4 border">Total Price</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset._id}>
                            <td className="py-2 px-4 border">{asset.assetName}</td>
                            <td className="py-2 px-4 border">{asset.quantity}</td>
                            <td className="py-2 px-4 border">{asset.perItemPrice}</td>
                            <td className="py-2 px-4 border">{asset.perItemPrice * asset.quantity}</td>
                            <td className="py-2 px-4 border">
                                <button
                                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                                    onClick={() => handleEdit(asset)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            &times;
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-xl font-bold mb-4">
                            {editMode ? 'Edit Asset' : 'Add New Asset'}
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Asset Name
                                </label>
                                <input
                                    type="text"
                                    value={assetName}
                                    onChange={(e) => setAssetName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="0"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Price Per Item
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={perItemPrice}
                                    onChange={(e) => setPerItemPrice(e.target.value)}
                                    min="0"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    {editMode ? 'Update Asset' : 'Add Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAssetModal;
