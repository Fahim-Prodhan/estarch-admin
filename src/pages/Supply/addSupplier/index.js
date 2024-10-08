import React, { useState, useEffect } from "react";
import Modal from "../../../components/Common/Modal.js";
import { Container } from "reactstrap";
import { Breadcrumbs } from "@material-ui/core";
import axios from 'axios';
import baseUrl from "../../../helpers/baseUrl.js";

const AddSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        businessName: "",
        email: "",
        mobile: "",
        area: "",
        address: "",
        purchaseTotal: "",
        due: 0,
        date: "",
        note: "",
        supplierType: "Product", // Default type
    });
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch suppliers data
                const suppliersResponse = await axios.get(`${baseUrl}/api/suppliers`);
                const suppliersData = suppliersResponse.data;
                setSuppliers(suppliersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddSupplier = () => {
        setEditingSupplier(null);
        setNewSupplier({
            name: "",
            businessName: "",
            email: "",
            mobile: "",
            area: "",
            address: "",
            purchaseTotal: "",
            due: 0,
            date: "",
            note: "",
            supplierType: "Product", // Reset to default
        });
        setModalOpen(true);
    };

    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setNewSupplier({ 
            ...supplier, 
            supplierType: supplier.supplierType || "Product", // Ensure supplierType is set
        });
        setModalOpen(true);
    };

    const handleSaveSupplier = () => {
        const supplierData = { ...newSupplier, due: parseFloat(newSupplier.due) || 0 }; // Convert due to number

        if (editingSupplier) {
            // Update existing supplier
            axios.put(`${baseUrl}/api/suppliers/${editingSupplier._id}`, supplierData)
                .then(response => {
                    const updatedSuppliers = suppliers.map((s) =>
                        s._id === response.data._id ? response.data : s
                    );
                    setSuppliers(updatedSuppliers);
                })
                .catch(error => {
                    console.error("There was an error updating the supplier!", error);
                });
        } else {
            // Add new supplier
            axios.post(`${baseUrl}/api/suppliers`, supplierData)
                .then(response => {
                    setSuppliers([...suppliers, response.data]);
                })
                .catch(error => {
                    console.error("There was an error adding the supplier!", error);
                });
        }
        setModalOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Add Supply" />
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Add Supplier</h2>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddSupplier}>
                                + Add New Supplier
                            </button>
                        </div>

                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">SL</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Name</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Mobile</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Area</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" colSpan="2">Purchase</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" colSpan="2">Purchase Return</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Advance</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Due Dismiss</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Total Due</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white" rowSpan="2">Action</th>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white">Total</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white">Pay</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white">Total</th>
                                    <th className="border border-gray-300 p-2 bg-green-600 text-center text-white">Pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier, index) => (
                                    <tr key={supplier._id}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{supplier.name}</td>
                                        <td className="border border-gray-300 p-2">{supplier.mobile}</td>
                                        <td className="border border-gray-300 p-2">{supplier.area}</td>
                                        <td className="border border-gray-300 p-2">{supplier.purchaseTotal}</td>
                                        <td className="border border-gray-300 p-2">{supplier.purchasePay}</td>
                                        <td className="border border-gray-300 p-2">{supplier.returnTotal}</td>
                                        <td className="border border-gray-300 p-2">{supplier.returnPay}</td>
                                        <td className="border border-gray-300 p-2">{supplier.advance}</td>
                                        <td className="border border-gray-300 p-2">{supplier.dueDismiss || 0}</td>
                                        <td className="border border-gray-300 p-2">{supplier.purchaseTotal - supplier.purchasePay}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded mr-2"
                                                onClick={() => handleEditSupplier(supplier)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSupplier ? "Edit Supplier" : "Create New Supplier"}
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
                            required
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
                            required
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
                        <label className="block text-sm font-medium">Purchase Total</label>
                        <input
                            type="number"
                            className="border border-gray-300 rounded p-2 w-full"
                            value={newSupplier.purchaseTotal}
                            onChange={(e) => setNewSupplier({ ...newSupplier, purchaseTotal: e.target.value })}
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
                    <div>
                        <label className="block text-sm font-medium">Note</label>
                        <textarea
                            className="border border-gray-300 rounded p-2 w-full"
                            value={newSupplier.note}
                            onChange={(e) => setNewSupplier({ ...newSupplier, note: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Supplier Type</label>
                        <select
                            className="border border-gray-300 rounded p-2 w-full"
                            value={newSupplier.supplierType}
                            onChange={(e) => setNewSupplier({ ...newSupplier, supplierType: e.target.value })}
                        >
                            <option value="Product">Product</option>
                            <option value="Product Asset">Product Asset</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default AddSupplier;
