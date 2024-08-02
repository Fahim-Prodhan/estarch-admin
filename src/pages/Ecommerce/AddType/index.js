import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchTypes, createType, updateType, deleteType } from "../../../utils/typeApi.js";
import Modal from '../../../components/Common/Modal.js';

const AddType = () => {
    const [types, setTypes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newType, setNewType] = useState('');
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        const getTypes = async () => {
            const data = await fetchTypes();
            setTypes(data);
        };
        getTypes();
    }, []);

    const handleAddType = () => {
        setEditingType(null);
        setNewType('');
        setModalOpen(true);
    };

    const handleEditType = (type) => {
        setEditingType(type);
        setNewType(type.name);
        setModalOpen(true);
    };

    const handleSaveType = async () => {
        if (editingType) {
            await updateType(editingType._id, newType);
        } else {
            await createType(newType);
        }
        setModalOpen(false);
        const data = await fetchTypes();
        setTypes(data);
    };

    const handleDeleteType = async (id) => {
        await deleteType(id);
        const data = await fetchTypes();
        setTypes(data);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Type" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Type List</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddType}>
                                + Add New Type
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">SL</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Type Name</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map((type, index) => (
                                    <tr key={type._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{type.name}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() => handleEditType(type)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded"
                                                onClick={() => handleDeleteType(type._id)}
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
                title={editingType ? "Edit Type" : "Add New Type"}
                onSave={handleSaveType}
            >
                <input
                    type="text"
                    placeholder="Type Name"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                />
            </Modal>
        </React.Fragment>
    );
};

export default AddType;
