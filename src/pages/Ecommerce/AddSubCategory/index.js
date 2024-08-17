import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { fetchCategories, fetchSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } from "../../../utils/categoryApi.js";
import Modal from '../../../components/Common/Modal.js';
import baseUrl from '../../../helpers/baseUrl.js';

const AddSubCategory = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newSubCategory, setNewSubCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newImage, setNewImage] = useState(''); // For image
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCategoriesAndSubCategories = async () => {
            try {
                const categoryData = await fetchCategories();
                setCategories(categoryData);
                const subCategoryData = await fetchSubCategories();
                console.log(subCategoryData);
                setSubCategories(Array.isArray(subCategoryData) ? subCategoryData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getCategoriesAndSubCategories();
    }, []);

    const handleAddSubCategory = () => {
        setEditingSubCategory(null);
        setNewSubCategory('');
        setSelectedCategory('');
        setNewImage(''); // Reset image
        setModalOpen(true);
    };

    const handleEditSubCategory = (subCategory) => {
        setEditingSubCategory(subCategory);
        setNewSubCategory(subCategory.name);
        setSelectedCategory(subCategory.category._id);
        setNewImage(subCategory.image || ''); // Set image
        setModalOpen(true);
    };

    const handleSaveSubCategory = async () => {
        try {
            if (editingSubCategory) {
                await updateSubCategory(editingSubCategory._id, newSubCategory, selectedCategory, newImage);
            } else {
                await createSubCategory(newSubCategory, selectedCategory, newImage);
            }
            setModalOpen(false);
            const data = await fetchSubCategories();
            setSubCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error saving subcategory:', error);
        }
    };

    const handleDeleteSubCategory = async (id) => {
        try {
            await deleteSubCategory(id);
            const data = await fetchSubCategories();
            setSubCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
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
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Sub Category" />
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Subcategory List</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddSubCategory}>
                                + Add New Subcategory
                            </button>
                        </div>
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <tr>
                                    <th className="py-3 px-6 text-left">SL</th>
                                    <th className="py-3 px-6 text-left">Sub Category Name</th>
                                    <th className="py-3 px-6 text-left">Category Name</th>
                                    <th className="py-3 px-6 text-left">Image</th> {/* New column for image */}
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {Array.isArray(subCategories) && subCategories.map((subCategory, index) => (
                                    <tr key={subCategory._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{index + 1}</td>
                                        <td className="py-3 px-6 text-left">{subCategory.name}</td>
                                        <td className="py-3 px-6 text-left">{subCategory.category ? subCategory.category.name : 'N/A'}</td>
                                        <td className="py-3 px-6 text-left">
                                            {subCategory.image && (
                                                <img src={subCategory.image} alt={subCategory.name} className="h-12 w-12 object-cover" />
                                            )}
                                        </td> {/* Display image */}
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                                onClick={() => handleEditSubCategory(subCategory)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDeleteSubCategory(subCategory._id)}
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
                title={editingSubCategory ? "Edit Subcategory" : "Add New Subcategory"}
                onSave={handleSaveSubCategory}
            >
                <select
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Sub Category Name"
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
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

export default AddSubCategory;
