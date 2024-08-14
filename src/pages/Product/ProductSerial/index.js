import React from 'react'
import { Container } from 'reactstrap'
import Breadcrumbs from "../../../components/Common/Breadcrumb";

function ProductSerial() {
    const products = [
        { id: 1, name: "JUST DO IT", sku: "hoodie1", qty: 8, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" },
        { id: 2, name: "New Premium T-Shirt", sku: "05T", qty: 45, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" },
        { id: 3, name: "New Premium T-Shirt", sku: "07T", qty: 1, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" },
        { id: 4, name: "New Premium T-Shirt", sku: "06T", qty: 5, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" },
        { id: 5, name: "Icon New T Shirt", sku: "10TS", qty: 0, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" },
        { id: 6, name: "PREMARK TROUSER", sku: "T02", qty: 36, img: "https://i.ibb.co/4TBWPVW/1-psd.jpg" }
    ];
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Product Serial" />
                    <div className="min-h-screen bg-gray-100 p-5">
                        <div className="container mx-auto">
                            <div className="flex justify-between items-center mb-5">
                                <h1 className="text-2xl font-semibold">Manage Product Serial</h1>
                                <button className="bg-orange-500 text-white px-4 py-2 rounded">Back</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white p-2 flex flex-col justify-center items-center rounded-lg shadow-md">
                                        <img src={product.img} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                                        <h2 className="text-base font-semibold">
                                            {product.name.length > 10 ? `${product.name.slice(0, 10)}...` : product.name}
                                        </h2>
                                        <p className="text-orange-500">{product.sku}</p>
                                        <p className="text-orange-500">Qty: {product.qty}</p>
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-3 w-full border rounded-md p-2"
                                            defaultValue={0}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ProductSerial