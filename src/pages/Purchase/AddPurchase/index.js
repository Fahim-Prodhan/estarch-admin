import { Breadcrumbs } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Modal from '../../../components/Common/Modal';

const AddPurchase = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        businessName: '',
        email: '',
        mobile: '',
        area: '',
        address: '',
        due: '',
        date: '',
        note: ''
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/suppliers');
                setSuppliers(response.data);
                if (response.data.length > 0) {
                    setSelectedSupplier(response.data[0].name);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleSaveSupplier = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/suppliers', newSupplier);
            setSuppliers([...suppliers, response.data]);
            setModalOpen(false);
            setNewSupplier({
                name: '',
                businessName: '',
                email: '',
                mobile: '',
                area: '',
                address: '',
                due: '',
                date: '',
                note: ''
            });
        } catch (error) {
            console.error('Error saving supplier:', error);
        }
    };



    const [totalAmount, setTotalAmount] = useState(0);
    const [due, setDue] = useState(0);



    const handleAmountChange = (index, value) => {
        const newPaymentTypes = [...paymentTypes];
        newPaymentTypes[index].amount = Number(value);
        setPaymentTypes(newPaymentTypes);
        updateDue(newPaymentTypes);
    };

    const updateDue = (newPaymentTypes) => {
        const totalPaid = newPaymentTypes.reduce((sum, pt) => sum + pt.amount, 0);
        setDue(totalAmount - totalPaid);
    };


    const [paymentTypes, setPaymentTypes] = useState([{ type: 'Cash', isOpen: true }]);

    const handlePaymentTypeChange = (index, value) => {
        const newPaymentTypes = [...paymentTypes];
        newPaymentTypes[index].type = value;
        setPaymentTypes(newPaymentTypes);
    };

    const addPaymentType = () => {
        setPaymentTypes([...paymentTypes, { type: 'Cash', isOpen: true }]);
    };

    const removePaymentType = (index) => {
        const newPaymentTypes = paymentTypes.filter((_, i) => i !== index);
        setPaymentTypes(newPaymentTypes);
    };

    const toggleSection = (index) => {
        const newPaymentTypes = [...paymentTypes];
        newPaymentTypes[index].isOpen = !newPaymentTypes[index].isOpen;
        setPaymentTypes(newPaymentTypes);
    };
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Create Type" />
                    <div className="p-6 bg-gray-100 min-h-screen">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Purchase Product</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700">Supplier Name</label>
                                    <div className='flex'>
                                        <select
                                            className="w-full mt-1 p-2 border rounded border-grey"
                                            value={selectedSupplier}
                                            onChange={(e) => setSelectedSupplier(e.target.value)}
                                        >
                                            {suppliers.map((supplier) => (
                                                <option key={supplier._id} value={supplier.name}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="ml-2 p-2 bg-green-500 text-white rounded"
                                            onClick={() => setModalOpen(true)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Invoice No</label>
                                    <input
                                        type="text"
                                        className="w-full mt-1 p-2 border rounded "
                                        value="IN-1071724869734"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Purchase Date</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 p-2 border rounded "
                                        value="2024-08-29"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700">Reference</label>
                                    <input
                                        type="text"
                                        placeholder="Reference"
                                        className="w-full mt-1 p-2 border rounded "
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700">Attachment</label>
                                    <input
                                        type="file"
                                        className="w-full mt-1 p-2 border rounded "
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Note</label>
                                <textarea
                                    placeholder="Note"
                                    className="w-full mt-1 p-2 border rounded h-20 "
                                ></textarea>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                            <div className="flex items-center mx-48">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    id="multiple"
                                />
                                <label htmlFor="multiple" className="text-gray-700 mr-4">Multiple</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Name/Sku/scan barcode"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <table className="w-full mt-4 border-collapse">
                                <thead>
                                    <tr className="bg-green-500 text-white">
                                        <th className="p-2 border">SL No</th>
                                        <th className="p-2 border">Product Name</th>
                                        <th className="p-2 border">Quantity</th>
                                        <th className="p-2 border">Purchase Price</th>
                                        <th className="p-2 border">Subtotal</th>
                                        <th className="p-2 border">Total</th>
                                        <th className="p-2 border">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>

                        </div>
                        <div className="container mx-auto p-4 flex justify-end">
                            <div className="w-1/3">
                                <div className="mb-4">
                                    <label>Item Count</label>
                                    <input type="text" className="form-control" value="0" readOnly />
                                </div>
                                <div className="mb-4">
                                    <label>Total Amount</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(Number(e.target.value))}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label>Payment Type</label>
                                    <div>
                                        {paymentTypes.map((payment, index) => (
                                            <div key={index} className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <select
                                                        className="form-select"
                                                        value={payment.type}
                                                        onChange={(e) => handlePaymentTypeChange(index, e.target.value)}
                                                        disabled={!payment.isOpen}
                                                    >
                                                        <option value="Cash">Cash</option>
                                                        <option value="Card">Card</option>
                                                        <option value="Online">Online</option>
                                                    </select>
                                                    <button className="btn btn-success" onClick={addPaymentType}>
                                                        Add Payment Type
                                                    </button>
                                                </div>
                                                {payment.isOpen && (
                                                    <div className='flex gap-5'>
                                                        <input className="form-control" />
                                                        <input className="form-control" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label>Due</label>
                                    <input type="text" className="form-control" value={due} readOnly />
                                </div>
                                <button className="btn btn-primary w-full">Buy</button>
                            </div>
                        </div>
                    </div>
                </Container>

                {/* Modal Component */}
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        title={false ? "Edit Supplier" : "Create New Supplier"}
                        onSave={handleSaveSupplier}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Name *</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.name}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Business Name</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.businessName}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, businessName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.email}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Mobile *</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.mobile}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, mobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Area</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.area}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, area: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.address}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Due</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.due}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, due: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.date}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, date: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Note</label>
                                <textarea
                                    className="border border-gray-300 rounded p-2 w-full"
                                    value={newSupplier.note}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, note: e.target.value })}
                                />
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </React.Fragment>
    );
};

export default AddPurchase;
