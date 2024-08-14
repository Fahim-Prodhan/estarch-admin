import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from "../../../helpers/baseUrl";
import { FaArrowRightLong } from 'react-icons/fa6';

const ViewOrderProduct = ({ isOpen, toggle, order }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (order && order.cartItems && order.cartItems.length > 0) {
            const fetchProductDetails = async () => {
                try {
                    const productIds = order.cartItems.map(item => item.productId); // Extract product IDs

                    const response = await axios.post(`${baseUrl}/api/orders/product`, {
                        productIds
                    });

                    console.log('Fetched products:', response.data);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            };

            fetchProductDetails();
        }
    }, [order]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={toggle}>
            <div className="modal-content mt-24 overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={toggle}>X</button>

                {selectedProduct ? (
                    <div className="product-details">
                        <button className="back-button mb-4" onClick={handleBackToList}>Back to List</button>
                        <div>
                            <img className='w-36 mx-auto' src={selectedProduct.images[0]} alt={selectedProduct.productName} />
                            <h2 className='text-2xl font-bold text-center'>{selectedProduct.productName}</h2>
                            <p className='text-lg'>{selectedProduct.description}</p>
                            <p className='text-lg font-semibold'>Price: {selectedProduct.salePrice} Taka</p>
                            <p className='text-lg font-semibold'>Ordered Quantity: {order.cartItems.find(item => item.productId === selectedProduct._id).quantity}</p>
                            <p className='text-lg font-semibold'>Ordered Size: {order.cartItems.find(item => item.productId === selectedProduct._id).size}</p>
                        </div>
                        <div className='grid grid-cols-3'>
                            {
                                selectedProduct.sizeDetails.map(s =>
                                    <div>
                                        <p className='text-[17px] font-bold flex items-center gap-2 mt-2'>Size  <FaArrowRightLong />  {s.size}</p>
                                        <hr />
                                        <p><span className='font-bold'>Barcode: </span><span className='text-success'>{s.barcode}</span></p>
                                        <p><span className='font-bold'>Opening Stock: </span><span className='text-error'>{s.openingStock} </span></p>
                                        <p><span className='font-bold'>Purchase Price: </span><span className='text-gray-500'>{s.purchasePrice} TK.</span></p>
                                        <p><span className='font-bold'>Selling Price: </span><span className='text-gray-500'>{s.sellingPrice} TK.</span></p>
                                        <p><span className='font-bold'>Discount Percentage: </span><span className='text-gray-500'>{s.discountPercent} TK.</span></p>
                                        <p><span className='font-bold'>Discount Flat: </span><span className='text-gray-500'>{s.discountAmount} TK.</span></p>
                                        <p><span className='font-bold'>After Flat: </span><span className='text-gray-500'>{s.afterDiscount} TK.</span></p>
                                        <p><span className='font-bold'>Hole Sale: </span><span className='text-gray-500'>{s.wholesalePrice} TK.</span></p>
                                        <p><span className='font-bold'>OSP Sale: </span><span className='text-gray-500'>{s.ospPrice} TK.</span></p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-3 gap-6 justify-center items-center'>
                        {products.map(p => (
                            <div key={p._id} onClick={() => handleProductClick(p)} className="cursor-pointer shadow-lg p-4 rounded-md">
                                <div>
                                    <img src={p.images[0]} alt={p.productName} />
                                    <p className='text-xl font-bold'>{p.productName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOrderProduct;
