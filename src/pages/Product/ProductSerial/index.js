import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from '../../../helpers/baseUrl';

function ProductSerial() {
    const [products, setProducts] = useState([]);
    const [serialNumbers, setSerialNumbers] = useState({});
// Fetch the products from the API when the component mounts
        const fetchProducts = async () => {
            const response = await fetch(`${baseUrl}/api/products/status-on-products`);
            const data = await response.json();
            setProducts(data);
        };
    useEffect(() => {
        
        fetchProducts();
    }, []);

    const handleSerialChange = (productId, value) => {
        setSerialNumbers(prev => ({
            ...prev,
            [productId]: value === "" ? undefined : parseInt(value)
        }));
    };

    const validateSerialNumbers = (serialNumbers, products) => {
        const serialNoSet = new Set();

        for (const product of products) {
            const serialNo = serialNumbers[product._id] !== undefined
                ? serialNumbers[product._id]
                : product.serialNo || 0;

            if (serialNo > 0) {
                if (serialNoSet.has(serialNo)) {
                    return false; // Duplicate serial number found
                }
                serialNoSet.add(serialNo);
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
            serialNo: serialNumbers[product._id] !== undefined
                ? serialNumbers[product._id]
                : product.serialNo || 0
        }));

        console.log(serializedProducts); // Log the serialized products

        try {
            const response = await fetch(`${baseUrl}/api/products/products/serials/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serialUpdates: serializedProducts })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchProducts()
            } else {
                console.error('Failed to update serial numbers', result);
            }
        } catch (error) {
            console.error('Error updating serial numbers', error);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Product Serial" />
                    <div className="min-h-screen bg-gray-100 p-5">
                        <div className="container mx-auto">
                            <div className="flex justify-between items-center mb-5">
                                <h1 className="text-2xl font-semibold">Manage Product Serial</h1>
                                <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded">
                                    Save Serial Numbers
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {products.map(product => (
                                    <div key={product._id} className="bg-white p-2 flex flex-col justify-center items-center rounded-lg shadow-md">
                                        <img src={`${baseUrl}/${product.images[0]}`} alt={product.productName} className="w-full h-40 object-cover rounded-md mb-4" />
                                        <h2 className="text-base font-semibold">
                                            {product?.productName?.length > 10 ? `${product.productName.slice(0, 10)}...` : product.productName}
                                        </h2>
                                        <p className="text-orange-500">{product.SKU}</p>
                                        <p className="text-orange-500">Qty: {product.qty}</p>
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-3 w-full border rounded-md p-2"
                                            defaultValue={product.serialNo}
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

export default ProductSerial;
