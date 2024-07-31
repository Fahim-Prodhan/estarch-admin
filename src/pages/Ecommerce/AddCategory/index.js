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
    const [imageUrl, setImageUrl] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setImageUrl('');
        setModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory(category.name);
        setImageUrl(category.image || '');
        setModalOpen(true);
    };

    const handleSaveCategory = async () => {
        const categoryData = {
            name: newCategory,
            image: imageUrl
        };

        if (editingCategory) {
            await updateCategory(editingCategory._id, categoryData);
        } else {
            await createCategory(categoryData);
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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setLoading(true); // Start loading

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setImageUrl(result.file); // Assuming 'file' contains the URL
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
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
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Image</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{category.name}</td>
                                        <td className="border border-gray-300 p-2">
                                            {category.image ? (
                                                <img src={category.image} alt={category.name} className="h-16 w-16 object-cover" />
                                            ) : (
                                                'No Image'
                                            )}
                                        </td>
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
                {imageUrl ? (
                    <div className="relative mt-2 w-36 h-36">
                        <img src={imageUrl} alt="Category" className="h-36 w-36 object-cover" />
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            X
                        </button>
                    </div>
                ) : (
                    <>
                        <label htmlFor="productImage" className="flex justify-center items-center border border-dashed border-gray-300 p-10 cursor-pointer">
                        <span className="text-gray-400">+</span>
                      </label>
                      <input
                        type="file"
                        id="productImage"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                        {loading && <p className="mt-2">Uploading...</p>}
                    </>
                )}
            </Modal>
        </React.Fragment>
    );
};

export default AddCategory;
