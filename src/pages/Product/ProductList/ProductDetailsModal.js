// ProductDetailsModal.js
import React from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

const ProductDetailsModal = ({ isOpen, toggle, product }) => {
  if (!isOpen) return null;

  console.log(product);
  

  return (
    <div className="modal-overlay" onClick={toggle}>
      <div className="modal-content mt-24 overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={toggle}>X</button>
        {product ? (
          <div >
            <img className='w-44 mx-auto p-6' src={product.images[0]} alt="" />
            <div className='space-y-4'>
              <div>
                <p className='text-xl font-semibold'>Product Information</p>
                <hr />
                <p><strong>Name:</strong> {product.productName}</p>
                <p><strong>Type:</strong> {product.selectedType}</p>
                <p><strong>Category:</strong> {product.selectedCategoryName}</p>
                <p><strong>SubCategory:</strong> {product.selectedSubCategory}</p>
                <p><strong>Brand:</strong> {product.selectedBrand}</p>
              </div>

              <div>
                <p className='text-xl font-semibold'>Status Information</p>
                <hr className='mb-2' />
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${product.productStatus === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Status <FaArrowRightLong /> {`${product.productStatus === true ? 'Active' : "Inactive"}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${product.posSuggestion === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Pos Suggestion <FaArrowRightLong /> {`${product.posSuggestion === true ? 'Active' : "Inactive"}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${product.showSize === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Show Size <FaArrowRightLong /> {`${product.showSize === true ? 'Active' : "Inactive"}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${product.featureProduct === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Feature <FaArrowRightLong /> {`${product.featureProduct === true ? 'Active' : "Inactive"}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={`bg-${product.freeDelevary === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md flex items-center gap-2`}>
                      Free Delivery <FaArrowRightLong /> {`${product.freeDelevary === true ? 'Active' : "Inactive"}`}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                
                <div className='grid grid-cols-3'>
                  {
                    product.sizeDetails.map(s =>
                      <div key={s._id}>
                        <p className='text-[17px] font-bold flex items-center gap-2 mt-2'>Size  <FaArrowRightLong />  {s.size}</p>
                        <hr />
                        <p><span className='font-bold'>Barcode: </span><span className='text-success'>{s.barcode}</span></p>
                        <p><span className='font-bold'>Stock: </span><span className='text-error'>{s.openingStock} </span></p>
                        <p><span className='font-bold'>Purchase Price: </span><span className='text-gray-500'>{s.purchasePrice} TK.</span></p>
                        <p><span className='font-bold'>Regular Price: </span><span className='text-gray-500'>{s.regularPrice} TK.</span></p>
                        <p><span className='font-bold'>Selling Price: </span><span className='text-gray-500'>{s.salePrice} TK.</span></p>
                        <p><span className='font-bold'>Discount Percentage: </span><span className='text-gray-500'>{s.discountPercent} %</span></p>
                        <p><span className='font-bold'>Discount Flat: </span><span className='text-gray-500'>{s.discountAmount} TK.</span></p>
                        <p><span className='font-bold'>Whole Sale: </span><span className='text-gray-500'>{s.wholesalePrice} TK.</span></p>
                      </div>
                    )
                  }
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
