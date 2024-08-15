import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchTypes, createType, updateType, deleteType } from "../../../utils/typeApi.js";
import Modal from '../../../components/Common/Modal.js';
import baseUrl from '../../../helpers/baseUrl.js';

const AddType = () => {
    const [types, setTypes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newType, setNewType] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        setNewImage(null);
        setModalOpen(true);
    };

    const handleEditType = (type) => {
        setEditingType(type);
        setNewType(type.name);
        setNewImage(null);
        setModalOpen(true);
    };

    const handleSaveType = async () => {
       
        if (editingType) {
            await updateType(editingType._id,newType , newImage);
        } else {
            await createType(newType , newImage);
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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);

        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setNewImage( result.file );
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setNewImage('');
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
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Image</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Type Name</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map((type, index) => (
                                    <tr key={type._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">
                                            {type.image ? (
                                                <img src={type.image} alt={type.name} className="w-16 h-16 object-cover" />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
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
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                />
                {newImage ? (
                   <div className="relative mt-2 w-36 h-36">
                        <img src={newImage} alt="Category" className="h-36 w-36 object-cover" />
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            X
                        </button>
                    </div>
                ) : <>
                        <label htmlFor="productImage" className="flex justify-center items-center border border-dashed border-gray-300 p-10 cursor-pointer">
                        <span className="text-gray-400">+</span>
                      </label>
                      <input
                        type="file"
                        id="productImage"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                        {isLoading && <p className="mt-2">Uploading...</p>}
                    </>}
            </Modal>
        </React.Fragment>
    );
};

export default AddType;
