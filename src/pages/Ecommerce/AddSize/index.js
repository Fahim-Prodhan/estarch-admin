import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchSizeTypes } from "../../../utils/sizeTypeApi.js";
import { fetchSizes, createSize, updateSize, deleteSize } from "../../../utils/sizeApi.js";
import Modal from '../../../components/Common/Modal.js';

const AddSize = () => {
    const [sizeTypes, setSizeTypes] = useState([]); // Add state for size types
    const [sizes, setSizes] = useState([]);
    const [selectedSizeType, setSelectedSizeType] = useState('');
    const [newSize, setNewSize] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState(null);

    useEffect(() => {
        const getSizeTypes = async () => {
            try {
                const data = await fetchSizeTypes();
                setSizeTypes(data);
            } catch (error) {
                console.error('Error fetching size types:', error);
            }
        };

        const getSizes = async () => {
            try {
                const data = await fetchSizes();
                setSizes(data);
                console.log(data);
                
            } catch (error) {
                console.error('Error fetching sizes:', error);
            }
        };

        getSizeTypes(); // Fetch size types
        getSizes(); // Fetch sizes
    }, []);

    const handleAddSize = () => {
        setEditingSize(null);
        setSelectedSizeType('');
        setNewSize('');
        setModalOpen(true);
    };

    const handleEditSize = (size) => {
        setEditingSize(size);
        setSelectedSizeType(size.sizeType?._id || ''); // Ensure _id is accessed correctly
        setNewSize(size.sizes.join(', ')); // Convert array to comma-separated string for editing
        setModalOpen(true);
    };

    const handleSaveSize = async () => {
        if (!selectedSizeType || !newSize) return;

        const sizesArray = newSize.split(',').map(size => size.trim());

        try {
            if (editingSize) {
                await updateSize(editingSize._id, selectedSizeType, sizesArray);
            } else {
                await createSize(selectedSizeType, sizesArray);
            }

            setModalOpen(false);
            const updatedSizes = await fetchSizes();
            setSizes(updatedSizes);
        } catch (error) {
            console.error('Error saving size:', error);
        }
    };

    const handleDeleteSize = async (id) => {
        try {
            await deleteSize(id);
            const updatedSizes = await fetchSizes();
            setSizes(updatedSizes);
        } catch (error) {
            console.error('Error deleting size:', error);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Size" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Size List</h2>
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md" 
                                onClick={handleAddSize}
                            >
                                + Add New Size
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">SL</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Size Type</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Sizes</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizes.map((size, index) => (
                                    <tr key={size._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{size.sizeType?.name || 'Unknown'}</td>
                                        <td className="border border-gray-300 p-2">{size.sizes.join(', ')}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() => handleEditSize(size)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded"
                                                onClick={() => handleDeleteSize(size._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSize ? "Edit Size" : "Add New Size"}
                onSave={handleSaveSize}
            >
                <select
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                    value={selectedSizeType}
                    onChange={(e) => setSelectedSizeType(e.target.value)}
                >
                    <option value="" disabled>Select Size Type</option>
                    {sizeTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                            {type.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Enter sizes (e.g., x, m, l, xl)"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                />
            </Modal>
        </React.Fragment>
    );
};

export default AddSize;
