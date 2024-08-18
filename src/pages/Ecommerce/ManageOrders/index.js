import React, { useContext } from "react";
import { Container } from "reactstrap";



//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";






const Dashboard = () => {

    document.title = "Estarch | Manage Order"

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Manage Order
                    " />

                    {/* Grid Here */}
                    <div className="grid md:grid-cols-2 gap-2 ">
                        <div className="p-4 border-2 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Customer Info</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue=""
                    
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue=""
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Address</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue=""
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Customer Note</label>
                                <textarea
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue=""
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Courier Name</label>
                                <select className="w-full px-3 py-2 border-2 rounded">
                                    <option>Select Courier</option>
                                    <option>SteadFast</option>
                                    <option>Pathao</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Order Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border-2 rounded"
                                    defaultValue="2024-06-02"
                                />
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border-2">
                            <h2 className="text-xl font-bold mb-4">Product Info</h2>
                            <div className="mb-4">
                                <input type="text" placeholder="Enter sku or barcode" className="input border-2"/>
                            </div>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2">Product</th>
                                        <th className="py-2">Quantity</th>
                                        <th className="py-2">Price</th>
                                        <th className="py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(3)].map((_, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-2">Premium Korean Style Polo</td>
                                            <td className="py-2 px-4 border-b-0 border-t-2 flex items-center">
                                                <button className="px-2 py-1 border-2 rounded">-</button>
                                                <input
                                                    type="number"
                                                    className="w-12 text-center border mx-2"
                                                    defaultValue="1"
                                                />
                                                <button className="px-2 py-1 border-2 rounded">+</button>
                                            </td>
                                            <td className="py-2 px-4 border-2">980</td>
                                            <td className="py-2 px-4 border-2">
                                                <button className="px-2 py-1 bg-red-500 text-white rounded">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ref. No</label>
                                    <input type="text" className="px-3 py-2 border-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Order Source</label>
                                    <select className="px-3 py-2 border-2 rounded">
                                        <option>Software</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between gap-2 flex-wrap">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sub Total</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border-2 rounded"
                                        defaultValue="2940"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border-2 rounded"
                                        defaultValue="40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Delivery Charge</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border-2 rounded"
                                        defaultValue="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total</label>
                                    <input
                                        type="text"
                                        className="px-3 py-2 border-2 rounded"
                                        defaultValue="2900"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;