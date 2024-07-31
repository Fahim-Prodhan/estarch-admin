// src/pages/AddBrand.js
import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchBrands, createBrand, updateBrand, deleteBrand } from "../../../utils/categoryApi.js";
import Modal from '../../../components/Common/Modal.js';

const AddBrand = () => {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newBrand, setNewBrand] = useState('');
    const [editingBrand, setEditingBrand] = useState(null);

    useEffect(() => {
        const getBrands = async () => {
            const data = await fetchBrands();
            setBrands(data);
        };
        getBrands();
    }, []);

    const handleAddBrand = () => {
        setEditingBrand(null);
        setNewBrand('');
        setModalOpen(true);
    };

    const handleEditBrand = (brand) => {
        setEditingBrand(brand);
        setNewBrand(brand.name);
        setModalOpen(true);
    };

    const handleSaveBrand = async () => {
        if (editingBrand) {
            await updateBrand(editingBrand._id, newBrand);
        } else {
            await createBrand(newBrand);
        }
        setModalOpen(false);
        const data = await fetchBrands();
        setBrands(data);
    };

    const handleDeleteBrand = async (id) => {
        await deleteBrand(id);
        const data = await fetchBrands();
        setBrands(data);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Manage Brands" />
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Brand List</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddBrand}>
                                + Add New Brand
                            </button>
                        </div>
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <tr>
                                    <th className="py-3 px-6 text-left">SL</th>
                                    <th className="py-3 px-6 text-left">Brand Name</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {brands.map((brand, index) => (
                                    <tr key={brand._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{index + 1}</td>
                                        <td className="py-3 px-6 text-left">{brand.name}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                                onClick={() => handleEditBrand(brand)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteBrand(brand._id)}
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
                title={editingBrand ? "Edit Brand" : "Add New Brand"}
                onSave={handleSaveBrand}
            >
                <input
                    type="text"
                    placeholder="Brand Name"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                />
            </Modal>
        </React.Fragment>
    );
};

export default AddBrand;
