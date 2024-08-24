import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../utils/categoryApi.js";
import { fetchTypes } from "../../../utils/typeApi.js";
import Modal from '../../../components/Common/Modal.js';
import baseUrl from '../../../helpers/baseUrl';

const AddCategory = () => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', type: '', image: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
        };
        getCategories();

        const getTypes = async () => {
            const data = await fetchTypes();
            setTypes(data);
        };
        getTypes();
    }, []);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setNewCategory({ name: '', type: '', image: '' });
        setModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, type: category.type?._id, image: category.image });
        setModalOpen(true);
    };

    const handleSaveCategory = async () => {
        if (editingCategory) {
            await updateCategory(editingCategory._id, newCategory.name, newCategory.type, newCategory.image);
        } else {
            await createCategory(newCategory.name, newCategory.type, newCategory.image);
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
        
        if (!file) {
            console.error('No file selected');
            return;
        }
    
        const formData = new FormData();
        console.log(formData);
        formData.append('image', file);
    
        setIsLoading(true);
    
        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                console.error('Image upload failed:', response.statusText);
                return;
            }
    
            const result = await response.json();
            console.log('Upload result:', result);
            if (result.file) {
                setNewCategory({ ...newCategory, image: result.file });
            } else {
                console.error('Image upload did not return a file path');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsLoading(false);
        }
    };
    


    const handleRemoveImage = () => {
        setNewCategory({ ...newCategory, image: '' });
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
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Category Type</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Category Image</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{category.name}</td>
                                        {category?.type && <td className="border border-gray-300 p-2">{category.type.name}</td>}
                                        <td className="border border-gray-300 p-2">
                                            {category.image && (
                                                <img
                                                    src={`${baseUrl}/${category.image}`}
                                                    alt={category.name}
                                                    className="h-16 w-16 object-cover"
                                                />
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
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <select
                    className="border border-gray-300 rounded p-2 w-full mt-2"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                        <option key={type._id} value={type._id}>
                            {type.name}
                        </option>
                    ))}
                </select>
                {newCategory?.image ? (
                    <div className="relative mt-2 w-36 h-36">
                        <img src={`${baseUrl}/${newCategory.image}`} alt="Category" className="h-36 w-36 object-cover" />
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
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                        {isLoading && <p className="mt-2">Uploading...</p>}
                    </>
                )}
            </Modal>
        </React.Fragment>
    );
};

export default AddCategory;
