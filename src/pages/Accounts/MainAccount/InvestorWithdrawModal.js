import axios from "axios";
import React, { useEffect, useState } from "react";
import baseUrl from "../../../helpers/baseUrl";

const InvestorWithdrawModal = ({ show, handleClose,fetchIncomingRequest,fetchMyRequest }) => {
  const [amount, setAmount] = useState(""); 
  const [paymentType, setPaymentType] = useState("cash");
  const [investors, setInvestors] = useState([]);
  const [receiverId, setReceiverId] = useState(null); // To store the selected investor ID

  // Fetch the list of investors when the component mounts
  useEffect(() => {
    try {
      axios.get(`${baseUrl}/api/account/investors`)
        .then(res => {
          setInvestors(res.data);
        });
    } catch (error) {
      console.error("Failed to fetch investors:", error);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parse amount as a float
    const floatAmount = parseFloat(amount);

    if (isNaN(floatAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    if (!receiverId) {
      alert("Please select an investor");
      return;
    }

    const senderId = JSON.parse(localStorage.getItem('userId'));

    // Form data
    const formData = {
      amount: floatAmount,
      accountType: paymentType,
      senderId,
      receiverId, // Include the selected investor's ID
      type: "withdraw",
    };

    try {
      await axios.post(`${baseUrl}/api/transaction/create`, formData);
      alert("Transaction Successful");
      fetchMyRequest()
      fetchMyRequest()
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed");
    }

    setAmount(""); 
    setPaymentType("cash");
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-96 p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
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
              Amount to Withdraw
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update state
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Amount"
              step="1" // Allows float values
              required
            />

            <label htmlFor="investor" className="block text-sm font-medium text-gray-700 mt-4">
              Select Investor
            </label>
            <select
              id="investor"
              value={receiverId} // Bind selected investor to state
              onChange={(e) => setReceiverId(e.target.value)} // Update state on selection
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="" >Select Investor</option>
              {investors.map((investor) => (
                <option key={investor._id} value={investor.userId}>
                  {investor.investorName}
                </option>
              ))}
            </select>

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
              type="submit"
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Withdraw
            </button>
          </div>
        </form>
        {/* Form ends here */}
      </div>
    </div>
  );
};

export default InvestorWithdrawModal;
