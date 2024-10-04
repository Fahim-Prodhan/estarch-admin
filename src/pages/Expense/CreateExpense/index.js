import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
// Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from "../../../helpers/baseUrl";

const CreateExpense = () => {
  document.title = "Estarch | Create Expense";

  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [isAsset, setIsAsset] = useState(false);
  const [assetName, setAssetName] = useState("");

  useEffect(() => {
    const fetchExpenseHeads = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/expense-heads/expense-heads`);
        const data = await response.json();

        if (response.ok) {
          setExpenseHeads(data.data); // Assuming the expense heads are in `data.data`
        } else {
          console.error("Failed to fetch expense heads:", data.message);
        }
      } catch (error) {
        console.error("Error fetching expense heads:", error);
      }
    };

    fetchExpenseHeads();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const senderId = JSON.parse(localStorage.getItem('userId'));
    // Create expense object
    const expenseData = {
      amount: parseFloat(amount), // Convert to number
      expenseType: isAsset ? assetName : expenseType, // Use assetName if isAsset is true
      details,
      quantity: isAsset ? parseInt(quantity) : 0, // Use quantity if isAsset is true, else set to 0
      isAsset,
      isApprove: false, // Set default approval status
      assetName: assetName,
      receiverId: '66f318d95e386d16be90a472',
      senderId
    };
    try {
      const response = await fetch(`${baseUrl}/api/expenses/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Expense created successfully:", data);
        alert("Expense created successfully")
        // Optionally reset the form or redirect the user
      } else {
        console.error("Error creating expense:", data.message);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  // Handle the selection change for expense type
  const handleChangeExpenseType = (e) => {
    setExpenseType(e.target.value);
  };

  // Handle checkbox change for switching between Expense Type and Asset Name
  const handleAssetCheckboxChange = (e) => {
    setIsAsset(e.target.checked);
  };

  return (
    <React.Fragment>
      <div className="page-content bg-white">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Expense" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Expense
            </p>
            <form className="lg:w-[60%] mx-auto grid md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="form-control border-none">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  className="input input-bordered"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              {isAsset ? (
                <div className="form-control border-none">
                  <label className="label">
                    <span className="label-text">Quantity</span>
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    className="input input-bordered"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              ) : null}

              {/* Conditionally render Expense Type or Asset Name based on checkbox */}
              {isAsset ? (
                <div className="form-control border-none md:col-span-2">
                  <label className="label">
                    <span className="label-text">Asset Name</span>
                  </label>
                  <input
                    name="assetName"
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="Asset Name"
                    className="input input-bordered"
                    required
                  />
                </div>
              ) : (
                <div className="form-control border-none">
                  <label className="label">
                    <span className="label-text">Expense Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={expenseType}
                    onChange={handleChangeExpenseType}
                    required
                  >
                    <option disabled value="">
                      Select Expense Type
                    </option>
                    {expenseHeads.map((expenseHead) => (
                      <option key={expenseHead._id} value={expenseHead.name}>
                        {expenseHead.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-control border-none md:col-span-2">
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  placeholder="Details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Save as Asset</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isAsset}
                    onChange={handleAssetCheckboxChange}
                  />
                </label>
              </div>

              <div className="form-control border-none md:col-span-2 place-self-center mt-5">
                <button type="submit" className="btn btn-sm btn-success text-white w-40 mx-auto mb-2">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateExpense;
