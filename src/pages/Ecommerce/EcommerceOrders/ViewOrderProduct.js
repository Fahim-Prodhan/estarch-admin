import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from "../../../helpers/baseUrl";

const ViewOrderProduct = ({ isOpen, toggle, order }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (order && order?.cartItems && order?.cartItems.length > 0) {
            const fetchProductDetails = async () => {
                try {
                    const productIds = order.cartItems.map(item => item.productId._id); // Extract product IDs

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
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={toggle}>
            <div className="modal-content mt-24 overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={toggle}>X</button>
                <div className='grid grid-cols-3 gap-6 justify-center items-center'>
                    {products.map(p => {
                        const cartItem = order.cartItems.find(item => item.productId._id === p._id);
                        const sizeDetail = p.sizeDetails.find(sizeDetail => sizeDetail.size === cartItem.size);

                        return (
                            <div key={p._id} className="shadow-lg rounded-md">
                                <div className='px-2 h-[340px]'>
                                    <div className='relative'>
                                        <img src={`${baseUrl}/${p.images[0]}`} alt={p.productName} />
                                        <p className='absolute bottom-2 left-1 bg-error text-white px-1 rounded-md'>{p.salePrice} Taka</p>
                                    </div>
                                    <p className='font-semibold pb-2 text-center'>{p.productName}</p>
                                    <p className=''><span className='font-semibold'>SKU:</span> {p.SKU}</p>
                                    <p className=''><span className='font-semibold'>Quantity:</span> {cartItem.quantity}</p>
                                    {sizeDetail && (
                                        <>
                                            <p className=''><span className='font-semibold'>Size:</span> <span className='italic'>{sizeDetail.barcode}</span> ({sizeDetail.size})</p>
                                            <p className=''><span className='font-semibold'>Stock:</span> {sizeDetail.openingStock}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderProduct;
