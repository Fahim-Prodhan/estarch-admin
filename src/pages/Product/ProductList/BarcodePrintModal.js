import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./barcodePrintModal.css"; // Create and import your CSS for styling

const BarcodePrintModal = ({ isOpen, toggle, product }) => {
  const [barcodeCounts, setBarcodeCounts] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e, size) => {
    const { value } = e.target;
    setBarcodeCounts(prevState => ({
      ...prevState,
      [size]: parseInt(value, 10),
    }));
  };

  const handleGenerate = () => {
    // Store the barcode counts and product details in sessionStorage or pass them as state
    sessionStorage.setItem(
      "barcodeData",
      JSON.stringify({ product, barcodeCounts })
    );
    // Redirect to the barcode display page
    navigate("/barcode-display");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Generate Barcodes</h2>
        </div>
        <div className="modal-body">
          {product?.sizeDetails?.map((sizeDetail, index) => (
            <div key={index} className="input-group">
              <label>Size: {sizeDetail.size}</label>
              <input
                type="number"
                min="0"
                placeholder="Enter number of barcodes"
                onChange={e => handleInputChange(e, sizeDetail.size)}
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="generate-button" onClick={handleGenerate}>
            Generate
          </button>
          <button className="cancel-button" onClick={toggle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodePrintModal;
