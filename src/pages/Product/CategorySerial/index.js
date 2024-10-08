import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from '../../../helpers/baseUrl';
import axios from 'axios';
import altImg from '../../../assets/avater.jpg'

function CategoryProductSerial() {
    const [products, setProducts] = useState([]);
    const [serialNumbers, setSerialNumbers] = useState({});
    const [categories, setCategories] = useState([]);
    const [CategoryName, SetCategoryName] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/categories/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    // Sort
    const handleCategoryNameChange = (e) => {
        SetCategoryName(e.target.value);
    };

    // Fetch the products from the API when the component mounts
    const fetchProducts = async () => {
        const response = await fetch(`${baseUrl}/api/products/products/category-status-on/products/${encodeURIComponent(CategoryName)}`);
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, [CategoryName]);

    const handleSerialChange = (productId, value) => {
        setSerialNumbers(prev => ({
            ...prev,
            [productId]: value === "" ? undefined : parseInt(value)
        }));
    };

    const validateSerialNumbers = (serialNumbers, products) => {
        const serialNoSet = new Set();

        for (const product of products) {
            const catSerialNo = serialNumbers[product._id] !== undefined
                ? serialNumbers[product._id]
                : product.catSerialNo || 0;

            if (catSerialNo > 0) {
                if (serialNoSet.has(catSerialNo)) {
                    return false; // Duplicate serial number found
                }
                serialNoSet.add(catSerialNo);
            }
        }

        return true; // No duplicates found
    };

    const handleSave = async () => {
        if (!validateSerialNumbers(serialNumbers, products)) {
            console.error('Duplicate serial numbers found!');
            alert('Duplicate serial numbers are not allowed!');
            return;
        }

        const serializedProducts = products.map(product => ({
            productId: product._id,
            catSerialNo: serialNumbers[product._id] !== undefined
                ? serialNumbers[product._id]
                : product.catSerialNo || 0
        }));

        console.log(serializedProducts); // Log the serialized products

        try {
            const response = await fetch(`${baseUrl}/api/products/products/category-serials/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serialUpdates: serializedProducts })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message)
                fetchCategories();
                fetchProducts();
            } else {
                console.error('Failed to update serial numbers', result);
            }
        } catch (error) {
            console.error('Error updating serial numbers', error);
        }
    };

    function calculateTotalOpeningStock(product) {
        // Check if sizeDetails exists and is an array
        if (Array.isArray(product.sizeDetails)) {
            // Calculate total opening stock by summing up the openingStock values
            return product.sizeDetails.reduce((total, sizeDetail) => {
                return total + sizeDetail.openingStock;
            }, 0);
        } else {
            // Return 0 if sizeDetails is not an array or does not exist
            return 0;
        }
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Category Serial" />
                    <div className="min-h-screen bg-gray-100 p-5">
                        <div className="container mx-auto">
                            <div className="flex justify-between items-center mb-5">
                                <h1 className="text-2xl font-semibold">Manage Product Serial</h1>
                                <select value={CategoryName} onChange={handleCategoryNameChange} className='select select-bordered select-sm' id="">
                                    <option value="">Select Category Name</option>
                                    {categories.map(item => (
                                        <option key={item._id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded">
                                    Save Serial Numbers
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {products.map(product => (
                                    <div key={product._id} className="bg-white p-2 flex flex-col justify-center items-center rounded-lg shadow-md">
                                        <img src={product.images[0] ? `${baseUrl}/${product.images[0]}` : altImg} alt={product.productName} className="w-full h-40 object-cover rounded-md mb-4" />
                                        <h2 className="text-base font-semibold">
                                            {product?.productName?.length > 10 ? `${product.productName.slice(0, 10)}...` : product.productName}
                                        </h2>
                                        <p className="text-orange-500">Sku: {product.SKU}</p>
                                        <p className="text-orange-500">Qty: {calculateTotalOpeningStock(product)}</p>
                                        {/* <p className="text-orange-500">Qty: {product.qty}</p> */}
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-3 w-full border rounded-md p-2"
                                            defaultValue={product.catSerialNo}
                                            onChange={(e) => handleSerialChange(product._id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default CategoryProductSerial;
