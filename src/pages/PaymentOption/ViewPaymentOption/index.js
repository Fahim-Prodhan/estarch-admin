import React, { useEffect, useState } from 'react';
import baseUrl from '../../../helpers/baseUrl';
import { useNavigate } from 'react-router-dom';
const ViewPaymentOption = () => {
    const [data, setData] = useState([
    ]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/payment/payment-options');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleEdit = ( paymentId) => {
        navigate(`/ecommerce-Payment-Option/${paymentId}`);
    };

    const handleDelete = async (accountId) => {
        try {
            const response = await fetch(`${baseUrl}/api/payment/payment-options/${accountId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the account');
            }

            // Remove the deleted item from the state
            setData(data.filter(item => item._id !== accountId));
            alert('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Payment Options</h1>
            <PaymentTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default ViewPaymentOption;

const PaymentTable = ({ data, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Option
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <React.Fragment key={item._id}>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.accountName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {item.accounts.map((account) => (
                                <React.Fragment key={account._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {account.accountType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                    </td>
                                    {account.payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {payment.paymentOption || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {payment.accountNumber || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
