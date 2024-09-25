import axios from "axios";
import React, { useState } from "react";
import baseUrl from "../../../helpers/baseUrl";

const InvestModal = ({ show, handleClose,allFetchingFun }) => {
  const [amount, setAmount] = useState(""); // State for amount
  const [paymentType, setPaymentType] = useState("cash"); // State for payment type

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parse amount as a float
    const floatAmount = parseFloat(amount);

    if (isNaN(floatAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    const senderId = JSON.parse(localStorage.getItem('userId'));
    const {data:mainAccount} = await axios.get(`${baseUrl}/api/account/main-account`)
    console.log(mainAccount);
    
    // Form data
    const formData = {
      amount: floatAmount,
      accountType:paymentType,
      senderId,
      receiverId:mainAccount.userId,
      type:"invest",
    };

    axios.post(`${baseUrl}/api/transaction/create`,formData)
    .then(res=>{
      alert("Transaction Successful")
      allFetchingFun()
    })
    // You can now use formData to send it to the backend or handle it as needed
    console.log(formData);

    setAmount(""); 
    setPaymentType("cash");
 
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-96 p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invest</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Form starts here */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount to Invest
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update state
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Amount"
              step="0.01" // Allows float values
              required
            />

            <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mt-4">
              Payment Type
            </label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)} // Update state
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="cash">Cash</option>
              {/* Add more payment options if needed */}
            </select>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit" // Change to submit
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Invest
            </button>
          </div>
        </form>
        {/* Form ends here */}
      </div>
    </div>
  );
};

export default InvestModal;
