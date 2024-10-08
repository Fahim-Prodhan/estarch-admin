import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from "../../../helpers/baseUrl";
import altImg from '../../../assets/avater.jpg';

const ManufactureProductList = () => {
    document.title = "Estarch | Product List";

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(10);
    const [count, SetCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);  // Selected product for details

    const pageRange = 2;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const onPageChange = (page) => {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        setCurrentPage(page);
    };

    console.log(products);


    const fetchData = () => {
        setLoading(true);
        fetch(`${baseUrl}/api/manufacture-product?page=${currentPage}&size=${limit}&search=${search}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data.manufactureProducts);
                SetCount(data.totalProducts);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [limit, search, currentPage]);

    // Function to handle detail button click
    const handleDetailsClick = (product) => {
        setSelectedProduct(product);
        const modal = document.getElementById("product-modal");
        modal.classList.remove("hidden"); // Show the modal
    };

    // Function to close the modal
    const closeModal = () => {
        const modal = document.getElementById("product-modal");
        modal.classList.add("hidden"); // Hide the modal
        setSelectedProduct(null); // Reset selected product
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Manufacture Product List" />
                    <div className="">
                        <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">Manufacture Product List</p>
                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <div className='flex justify-between items-center'>
                                            <select
                                                onChange={(e) => setLimit(e.target.value)}
                                                name="" id="" className=' select select-bordered'>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="150">150</option>
                                            </select>

                                            <label className="input input-bordered w-full max-w-xs flex items-center gap-2">
                                                <input onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} type="text" className="grow w-full max-w-sm" placeholder="Search with SKU" />
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                    className="h-4 w-4 opacity-70">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                                        clipRule="evenodd" />
                                                </svg>
                                            </label>
                                        </div>

                                        {loading ? (
                                            <div className="mx-auto flex gap-4">
                                                <span className="loading loading-bars loading-xs"></span>
                                                <span className="loading loading-bars loading-sm"></span>
                                                <span className="loading loading-bars loading-md"></span>
                                                <span className="loading loading-bars loading-lg"></span>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto overflow-y-hidden">
                                                <table className="table table-zebra">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Image</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Product Info</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">SKU</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Cost Per Product</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Total Manufacture</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Others Cost</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Total Cost</th>
                                                            <th className="border-1 border-gray-200 border-opacity-75">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {products?.map(item => (
                                                            <tr key={item._id}>
                                                                <td className="border-1 border-gray-200 border-opacity-75">
                                                                    <div className="w-12 flex justify-center">
                                                                        <div className="flex justify-center">
                                                                            <img
                                                                                src={item?.productId.images[0] ? `${baseUrl}/${item?.productId.images[0]}` : altImg}
                                                                                alt='Product images'
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="border-1 border-gray-200 border-opacity-75">
                                                                    <div className="w-44 p-0">
                                                                        <p><span className="font-bold">Name:</span> <span>{item?.productId?.productName}</span></p>
                                                                        <p><span className="font-bold">Version:</span> <span>V{item?.version}.00</span></p>
                                                                    </div>
                                                                </td>
                                                                <td className="border-1 border-gray-200 border-opacity-75">
                                                                    <div className="p-0">
                                                                        <p><span className="font-bold">Sku:</span> <span>{item?.productId?.SKU}</span></p>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center border-1 border-gray-200 border-opacity-75">
                                                                    <p>{item?.costPerProduct} ৳</p>
                                                                </td>
                                                                <td className="text-center border-1 border-gray-200 border-opacity-75">
                                                                    <p>{item?.totalProduct} </p>
                                                                </td>
                                                                <td className="text-center border-1 border-gray-200 border-opacity-75">
                                                                    <p>{item?.otherCost} ৳</p>
                                                                </td>
                                                                <td className="text-center border-1 border-gray-200 border-opacity-75">
                                                                    <p>{((item?.costPerProduct*item?.totalProduct)+item?.otherCost)} ৳</p>
                                                                </td>
                                                                <td className="border-1 border-gray-200 border-opacity-75">
                                                                    <button
                                                                        className="btn btn-sm btn-primary text-white"
                                                                        onClick={() => handleDetailsClick(item)}
                                                                    >
                                                                        Details
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={() => onPageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Prev
                                            </button>

                                            {getPageNumbers().map((pageNumber, index) => {
                                                if (pageNumber === '...') {
                                                    return (
                                                        <span key={index} className="px-4 py-2 mx-1 text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => onPageChange(pageNumber)}
                                                        className={`px-4 py-2 rounded mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => onPageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container >

                {/* Modal for displaying asset details */}
                <div div id="product-modal" className="fixed inset-0 z-50 hidden flex items-center justify-center bg-black bg-opacity-50" >
                    <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-[700px] w-full">
                        <h2 className="text-xl font-bold mb-4">Asset Details</h2>
                        {selectedProduct ? (
                            <div>
                                <div className="">
                                    <img src={selectedProduct.productId.images[0] ? `${baseUrl}/${selectedProduct.productId.images[0]}` : altImg} alt="Product" className="w-full max-w-16 rounded-md mx-auto" />
                                    <h5 className="text-sm font-semibold my-1 text-center">{selectedProduct.productId.productName}</h5>
                                    <p className="text-center text-lg font-bold text-orange-500 mt-6">Assets</p>
                                    <hr className="my-2" />
                                    <div className="flex justify-start gap-12">
                                        {
                                            selectedProduct?.assets.map((asset, index) =>
                                                <div key={asset._id} className="space-y-2">
                                                    <p className="btn btn-primary btn-sm text-white">{index + 1}. {asset?.assetId?.assetName}</p>
                                                    <p>Total used: {asset?.usedQuantity}</p>
                                                    <p>Total Price: {asset?.usedQuantity * asset?.assetId?.perItemPrice} ৳</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No product selected.</p>
                        )}
                        <button className="mt-12 bg-red-500 text-white py-2 px-4 rounded" onClick={closeModal}>Close</button>
                    </div>
                </div >

            </div >
        </React.Fragment >
    );
};

export default ManufactureProductList;
