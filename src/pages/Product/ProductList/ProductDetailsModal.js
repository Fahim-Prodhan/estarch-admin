import React, { useState, useEffect } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import baseUrl from '../../../helpers/baseUrl';

const ProductDetailsModal = ({ isOpen, toggle, product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  useEffect(() => {
    if (product) {
      const fetchPurchaseData = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/purchase`);
          const purchases = await response.json();
  
          // Check if purchases is an array
          if (!Array.isArray(purchases)) {
            console.error('Unexpected data structure:', purchases);
            return;
          }
  
          // Create maps to track stock and purchase price updates by barcode
          const stockUpdates = {};
          const priceUpdates = {};
  
          purchases.forEach(purchase => {
            if (purchase.items && Array.isArray(purchase.items)) {
              purchase.items.forEach(item => {
                if (item.product && item.product.sizeDetails) {
                  item.product.sizeDetails.forEach(sizeDetail => {
                    // Update stock
                    if (!stockUpdates[sizeDetail.barcode]) {
                      stockUpdates[sizeDetail.barcode] = 0;
                    }
                    stockUpdates[sizeDetail.barcode] += item.quantity;
  
                    // Update purchase price (take the latest price)
                    priceUpdates[sizeDetail.barcode] = item.purchasePrice;
                  });
                }
              });
            }
          });
  
          // Update product sizeDetails based on stockUpdates and priceUpdates
          const updatedSizeDetails = product.sizeDetails.map(sizeDetail => {
            const addedStock = stockUpdates[sizeDetail.barcode] || 0;
            const newPurchasePrice = priceUpdates[sizeDetail.barcode] || sizeDetail.purchasePrice;
  
            return {
              ...sizeDetail,
              openingStock: (sizeDetail.openingStock || 0), // Update stock
              purchasePrice: newPurchasePrice // Update purchase price
            };
          });
  
          setUpdatedProduct({
            ...product,
            sizeDetails: updatedSizeDetails
          });
        } catch (error) {
          console.error('Error fetching purchase data:', error);
        }
      };
  
      fetchPurchaseData();
    }
  }, [product]);
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggle}>
      <div className="modal-content mt-24 overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={toggle}>X</button>
        {updatedProduct ? (
          <div>
            <img className='w-44 mx-auto p-6' src={updatedProduct.images[0]} alt="" />
            <div className='space-y-4'>
              <div>
                <p className='text-xl font-semibold'>Product Information</p>
                <hr />
                <p><strong>Name:</strong> {updatedProduct.productName}</p>
                <p><strong>Type:</strong> {updatedProduct.selectedType}</p>
                <p><strong>Category:</strong> {updatedProduct.selectedCategoryName}</p>
                <p><strong>SubCategory:</strong> {updatedProduct.selectedSubCategory}</p>
                <p><strong>Brand:</strong> {updatedProduct.selectedBrand}</p>
              </div>

              <div>
                <p className='text-xl font-semibold'>Status Information</p>
                <hr className='mb-2' />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${updatedProduct.productStatus ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Status <FaArrowRightLong /> {updatedProduct.productStatus ? 'Active' : "Inactive"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${updatedProduct.posSuggestion ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Pos Suggestion <FaArrowRightLong /> {updatedProduct.posSuggestion ? 'Active' : "Inactive"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${updatedProduct.showSize ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Show Size <FaArrowRightLong /> {updatedProduct.showSize ? 'Active' : "Inactive"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${updatedProduct.featureProduct ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Feature <FaArrowRightLong /> {updatedProduct.featureProduct ? 'Active' : "Inactive"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${updatedProduct.freeDelevary ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Free Delivery <FaArrowRightLong /> {updatedProduct.freeDelevary ? 'Active' : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className='grid grid-cols-3'>
                  {updatedProduct.sizeDetails.map(s =>
                    <div key={s._id}>
                      <p className='text-[17px] font-bold flex items-center gap-2 mt-2'>Size  <FaArrowRightLong />  {s.size}</p>
                      <hr />
                      <p><span className='font-bold'>Barcode: </span><span className='text-success'>{s.barcode}</span></p>
                      <p><span className='font-bold'>Stock: </span><span className='text-error'>{s.openingStock || 0}</span></p>
                      <p><span className='font-bold'>Purchase Price: </span><span className='text-gray-500'>{s.purchasePrice || 0} TK.</span></p>
                      <p><span className='font-bold'>Regular Price: </span><span className='text-gray-500'>{s.regularPrice || 0} TK.</span></p>
                      <p><span className='font-bold'>Selling Price: </span><span className='text-gray-500'>{s.salePrice || 0} TK.</span></p>
                      <p><span className='font-bold'>Discount Percentage: </span><span className='text-gray-500'>{s.discountPercent || 0} %</span></p>
                      <p><span className='font-bold'>Discount Flat: </span><span className='text-gray-500'>{s.discountAmount || 0} TK.</span></p>
                      <p><span className='font-bold'>Whole Sale: </span><span className='text-gray-500'>{s.wholesalePrice || 0} TK.</span></p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <p>No product details available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
