import React, { useEffect, useState } from "react";
import logo from '../../../assets/images/logo-dark.png';
import './Barcode.css'; // Import the CSS file

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
  console.log(product);

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
                    <img className="logo" src={logo} alt="Logo" />
                    <p className="product-info font-mono">
                      <span className="font-bold">{product.SKU}</span> ({sizeDetail.size})
                    </p>
                  </div>
                  <img
                    className="barcode-img"
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${sizeDetail.barcode}&code=Code128`}
                    alt={`Barcode for ${sizeDetail.size}`}
                  />
                  <p className="font-bold font-mono text-xl text-black">Price: {sizeDetail.sellingPrice} ৳</p>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center my-12">  
        <button className="print-button" onClick={handlePrint}>
        Print
      </button>
      </div>
    </div>
  );
};

export default BarcodeDisplay;
