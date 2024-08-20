import React, { useEffect, useState } from "react";
import logo from '../../../assets/images/logo-dark.png';
import './Barcode.css'; // Import the CSS file
import Barcode from 'react-barcode';

const BarcodeDisplay = () => {
  const [barcodeData, setBarcodeData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("barcodeData");
    if (storedData) {
      setBarcodeData(JSON.parse(storedData));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!barcodeData) {
    return <p>No barcode data found.</p>;
  }

  const { product, barcodeCounts } = barcodeData;

  return (
    <div className="barcode-display-page bg-white">
      <div className="barcode-grid">
        {product.sizeDetails.map((sizeDetail, index) => {
          const count = barcodeCounts[sizeDetail.size] || 0;
          return (
            <React.Fragment key={index}>
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="barcode-wrapper">
                  <div className="logo-and-text">
                    <img className="logo mx-auto w-[65px] mt-1" src={logo} alt="Logo" />
                    <p className="font-extrabold product-info text-[8px] text-center -mb-[2px] text-black">
                      <span className="font-extrabold">{product.SKU}</span> ({sizeDetail.size})
                    </p>
                  </div>
                  <Barcode
                    className='barcode mx-auto h-[40px]'
                    value={sizeDetail.barcode}
                    displayValue={false}
                    lineColor="#00000"
                    height={50}     
                  />
                  <p className="font-semibold text-black price text-center text-[10px] font-mono -mt-[3px]">{sizeDetail.barcode}</p>
                  <p className="font-bold text-black price text-center text-[11px] ">Price: {sizeDetail.regularPrice} ৳</p>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center">  
        <button className="print-button" onClick={handlePrint}>
          Print
        </button>
      </div>
    </div>
  );
};

export default BarcodeDisplay;
