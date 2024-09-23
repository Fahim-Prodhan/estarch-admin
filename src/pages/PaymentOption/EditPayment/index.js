import React, { useEffect, useState } from 'react';
import { IoMdTrash } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from '../../../helpers/baseUrl';
import { useParams } from 'react-router-dom';

function EditPayment() {
    const { id } = useParams()
    const [accountFields, setAccountFields] = useState({
        accountName: '',
        accounts: [
            { accountType: '', payments: [{ paymentOption: '', accountNumber: '' }] }
        ]
    });
    useEffect(() => {
        const fetchPaymentOptions = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/payment/payment-options/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch payment options');
                }
                const data = await response.json();
                setAccountFields(data);
            } catch (error) {

            } finally {

            }
        };

        fetchPaymentOptions();
    }, [id]);
    const handleAddAccountType = () => {
        setAccountFields((prevFields) => ({
            ...prevFields,
            accounts: [
                ...prevFields.accounts,
                { accountType: '', payments: [{ paymentOption: '', accountNumber: '' }] }
            ]
        }));
    };

    const handleRemoveAccountType = (index) => {
        setAccountFields((prevFields) => ({
            ...prevFields,
            accounts: prevFields.accounts.filter((_, i) => i !== index)
        }));
    };

    const handleAddPaymentOption = (accountIndex) => {
        setAccountFields((prevFields) => {
            const updatedAccounts = prevFields.accounts.map((field, i) =>
                i === accountIndex
                    ? { ...field, payments: [...field.payments, { paymentOption: '', accountNumber: '' }] }
                    : field
            );
            return { ...prevFields, accounts: updatedAccounts };
        });
    };

    const handleRemovePaymentOption = (accountIndex, paymentIndex) => {
        setAccountFields((prevFields) => {
            const updatedAccounts = prevFields.accounts.map((field, i) =>
                i === accountIndex
                    ? { ...field, payments: field.payments.filter((_, p) => p !== paymentIndex) }
                    : field
            );
            return { ...prevFields, accounts: updatedAccounts };
        });
    };

    const handleChange = (accountIndex, paymentIndex, e) => {
        const { name, value } = e.target;
        setAccountFields((prevFields) => {
            const updatedAccounts = prevFields.accounts.map((field, i) =>
                i === accountIndex
                    ? {
                        ...field,
                        payments: field.payments.map((payment, p) =>
                            p === paymentIndex ? { ...payment, [name]: value } : payment
                        ),
                        ...(paymentIndex === null && { [name]: value }) // Update accountType if no paymentIndex is passed
                    }
                    : field
            );
            return { ...prevFields, accounts: updatedAccounts };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/payment/payment-options`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountFields),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response Data: ', data);
        } catch (error) {
            console.error('Error:', error);
        }
        setAccountFields({
            accountName: '',
            accounts: [
                { accountType: '', payments: [{ paymentOption: '', accountNumber: '' }] }
            ]
        })
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="Estarch" breadcrumbItem="Payment Option Edit" />
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded shadow-md w-full"
                >
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Account Form</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Account Name</label>
                        <select
                            name="accountName"
                            value={accountFields.accountName}
                            onChange={(e) => setAccountFields({ ...accountFields, accountName: e.target.value })}
                            className="block w-full mt-2 p-2 border border-black rounded"
                        >
                            <option value="" disabled>Select Account name</option>
                            <option value="showroom">Showroom</option>
                            <option value="online">Online</option>
                            <option value="wholesale">Whole Sale</option>
                        </select>
                    </div>

                    {accountFields.accounts.map((field, accountIndex) => (
                        <div key={accountIndex} className="mb-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 ">Account Type</label>
                                <div className="flex gap-5">
                                    <select
                                        name="accountType"
                                        value={field.accountType}
                                        onChange={(e) => handleChange(accountIndex, null, e)}
                                        className="block w-full mt-2 p-2 border border-black rounded"
                                    >
                                        <option value="" disabled>Select Account Type</option>
                                        <option value="card">Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="mobilebank">Mobile Bank</option>
                                    </select>
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAddAccountType}
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        >
                                            <FiPlus />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAccountType(accountIndex)}
                                            className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 ${accountFields.accounts.length === 1 ? 'hidden' : ''}`}
                                        >
                                            <IoMdTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {field.payments.map((payment, paymentIndex) => (
                                <div key={paymentIndex} className="mb-4 flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700">Payment Option</label>
                                        <input
                                            type="text"
                                            name="paymentOption"
                                            value={payment.paymentOption}
                                            onChange={(e) => handleChange(accountIndex, paymentIndex, e)}
                                            placeholder="Enter Payment Option"
                                            className="block w-full mt-2 p-2 border border-black rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-gray-700">Account Number</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={payment.accountNumber}
                                            onChange={(e) => handleChange(accountIndex, paymentIndex, e)}
                                            placeholder="Enter Account Number"
                                            className="block w-full mt-2 p-2 border border-black rounded"
                                        />
                                    </div>
                                    <div className="mt-3 flex justify-center items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddPaymentOption(accountIndex)}
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        >
                                            <FiPlus />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePaymentOption(accountIndex, paymentIndex)}
                                            className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 ${field.payments.length === 1 ? 'hidden' : ''}`}
                                        >
                                            <IoMdTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </React.Fragment>
    )
}

export default EditPayment