import axios from "axios";
import React, { useState, useEffect } from "react";
import baseUrl from "../../../helpers/baseUrl";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
const CourierAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [withdrawAmount, setWithdrawAmount] = useState(0); // Amount input state
    const [deliveryCharge, setDeliveryCharge] = useState(20); // Default delivery charge
    const [codCharge, setCodCharge] = useState(10); // Default COD charge
    const [netAmount, setNetAmount] = useState(0); // Calculated net amount

    const [accountData, setAccountData] = useState({});
    // Fetch courier account data on component mount
    useEffect(() => {
        axios.get(`${baseUrl}/api/courier-account`)
            .then(response => {
                console.log(response.data);
                setAccountData(response.data);
            })
            .catch(error => console.error('Error fetching account:', error));
    }, [isModalOpen]);
    // Calculate net amount whenever input changes
    useEffect(() => {
        setNetAmount(withdrawAmount - deliveryCharge - codCharge);
    }, [withdrawAmount, deliveryCharge, codCharge]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleWithdraw = () => {
        if (withdrawAmount > accountData.availableAmount) {
            alert('Insufficient balance');
            return;
        }
        const amount = parseInt(withdrawAmount, 10);
        axios.post(`${baseUrl}/api/courier-account/withdraw`, {
            amount: amount,
            deliveryCharge,
            codCharge,
        })
            .then(response => {
                setAccountData(response.data); // Update account data
                setIsModalOpen(false); // Close modal
            })
            .catch(error => console.error('Error processing withdrawal:', error));
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const datePart = date.toLocaleDateString('en-US', options);
        const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${datePart} ${timePart}`;
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Courier Account" />
                    <div className="min-h-screen bg-gray-100 p-6">
                        <div className="w-full bg-white shadow-md rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium">Total Earned</h2>
                                    <p className="text-xl font-semibold mt-2">{accountData?.totalEarned}tk</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium">Available Amount</h2>
                                    <p className="text-xl font-semibold mt-2">{accountData?.availableAmount}tk</p>
                                </div>
                                <div className="bg-red-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-medium">Total Withdrawn</h2>
                                    <p className="text-xl font-semibold mt-2">{accountData?.totalWithdrawAmount}tk</p>
                                </div>
                            </div>

                            <button
                                onClick={openModal}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Withdraw
                            </button>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-bold mb-4">Withdrawal History</h2>
                                <div className="grid grid-cols-6 gap-4 border-b-2 border-gray-300 mb-4">
                                    <div className="font-bold">ID</div>
                                    <div className="font-bold">Amount</div>
                                    <div className="font-bold">Delivery Charge</div>
                                    <div className="font-bold">COD Charge</div>
                                    <div className="font-bold">Net Amount</div>
                                    <div className="font-bold">Date</div>
                                </div>
                                {accountData?.withdrawals?.length > 0 ? (
                                    <div className="overflow-y-scroll h-[300px]">
                                        {accountData.withdrawals.reverse().map((withdrawal, i) => (
                                            <div key={withdrawal.id} className="grid grid-cols-6 border border-gray-200 p-2 mb-2">
                                                <div className="border border-gray-300 px-4 py-2">{i + 1}</div>
                                                <div className="border border-gray-300 px-4 py-2">{withdrawal.amount}tk</div>
                                                <div className="border border-gray-300 px-4 py-2">{withdrawal.deliveryCharge}tk</div>
                                                <div className="border border-gray-300 px-4 py-2">{withdrawal.codCharge}tk</div>
                                                <div className="border border-gray-300 px-4 py-2">{withdrawal.netAmount}tk</div>
                                                <div className="border border-gray-300 px-4 py-2">{formatDate(withdrawal.date)}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">No withdrawals made yet.</p>
                                )}
                            </div>

                            {isModalOpen && (
                                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-xl font-bold mb-4">Make a Withdrawal</h2>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full border px-4 py-2 rounded-md mb-4"
                                        />
                                        <input
                                            type="number"
                                            value={deliveryCharge}
                                            onChange={(e) => setDeliveryCharge(e.target.value)}
                                            placeholder="Delivery charge"
                                            className="w-full border px-4 py-2 rounded-md mb-4"
                                        />
                                        <input
                                            type="number"
                                            value={codCharge}
                                            onChange={(e) => setCodCharge(e.target.value)}
                                            placeholder="COD charge"
                                            className="w-full border px-4 py-2 rounded-md mb-4"
                                        />
                                        <div className="mb-4">
                                            <h3 className="text-lg font-medium">
                                                Net Amount: <span>${netAmount}</span>
                                            </h3>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={closeModal}
                                                className="bg-gray-400 text-white px-4 py-2 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleWithdraw}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CourierAccount;
