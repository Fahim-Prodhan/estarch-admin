import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchSizeTypes, createSizeType, updateSizeType, deleteSizeType } from "../../../utils/sizeTypeApi.js";
import Modal from '../../../components/Common/Modal.js';

const AddSizeType = () => {
    const [sizeTypes, setSizeTypes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newSizeType, setNewSizeType] = useState('');
    const [editingSizeType, setEditingSizeType] = useState(null);

    useEffect(() => {
        const getSizeTypes = async () => {
            const data = await fetchSizeTypes();
            setSizeTypes(data);
        };
        getSizeTypes();
    }, []);

    const handleAddSizeType = () => {
        setEditingSizeType(null);
        setNewSizeType('');
        setModalOpen(true);
    };

    const handleEditSizeType = (sizeType) => {
        setEditingSizeType(sizeType);
        setNewSizeType(sizeType.name);
        setModalOpen(true);
    };

    const handleSaveSizeType = async () => {
        if (editingSizeType) {
            await updateSizeType(editingSizeType._id, newSizeType);
        } else {
            await createSizeType(newSizeType);
        }
        setModalOpen(false);
        const data = await fetchSizeTypes();
        setSizeTypes(data);
    };

    const handleDeleteSizeType = async (id) => {
        await deleteSizeType(id);
        const data = await fetchSizeTypes();
        setSizeTypes(data);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Size Type" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Size Type List</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddSizeType}>
                                + Add New Size Type
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">SL</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Size Type Name</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizeTypes.map((sizeType, index) => (
                                    <tr key={sizeType._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{sizeType.name}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() => handleEditSizeType(sizeType)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded"
                                                onClick={() => handleDeleteSizeType(sizeType._id)}
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
                title={editingSizeType ? "Edit Size Type" : "Add New Size Type"}
                onSave={handleSaveSizeType}
            >
                <input
                    type="text"
                    placeholder="Size Type Name"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newSizeType}
                    onChange={(e) => setNewSizeType(e.target.value)}
                />
            </Modal>
        </React.Fragment>
    );
};

export default AddSizeType;
