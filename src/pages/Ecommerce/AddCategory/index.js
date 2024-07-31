// src/pages/AddCategory.js
import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../utils/categoryApi.js";
import Modal from '../../../components/Common/Modal.js';

const AddCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        };
        getCategories();
    }, []);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setNewCategory('');
        setModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory(category.name);
        setModalOpen(true);
    };

    const handleSaveCategory = async () => {
        if (editingCategory) {
            await updateCategory(editingCategory._id, newCategory);
        } else {
            await createCategory(newCategory);
        }
        setModalOpen(false);
        const data = await fetchCategories();
        setCategories(data);
    };

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id);
        const data = await fetchCategories();
        setCategories(data);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Category" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Category List</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddCategory}>
                                + Add New Category
                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">SL</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Category Name</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{category.name}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() => handleEditCategory(category)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded"
                                                onClick={() => handleDeleteCategory(category._id)}
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
                title={editingCategory ? "Edit Category" : "Add New Category"}
                onSave={handleSaveCategory}
            >
                <input
                    type="text"
                    placeholder="Category Name"
                    className="border border-gray-300 rounded p-2 w-full"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
            </Modal>
        </React.Fragment>
    );
};

export default AddCategory;
