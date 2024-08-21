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
                    <img className="logo mx-auto w-[70px] mt-1" src={logo} alt="Logo" />
                    <p className="font-extrabold font_share product-info text-[10px] text-center  text-black relative top-1 z-10">
                      <span className="font-extrabold">{product.SKU}</span> ({sizeDetail.size})
                    </p>
                  </div>
                  <Barcode
                    className='barcode mx-auto h-[40px]'
                    value={sizeDetail.barcode}
                    displayValue={true}
                    lineColor="#00000"
                    height={60}     
                  />
                  {/* <p className="font-semibold  text-black price text-center text-[11px] font-mono  relative bottom-1">{sizeDetail.barcode}</p> */}
                  <p className="font-bold font_share text-black price text-center text-[12px] -mt-[8px]">Price: {sizeDetail.regularPrice} ৳</p>
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
