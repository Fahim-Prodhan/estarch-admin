import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from "../../../helpers/baseUrl";
import ProductDetailsModal from "./ProductDetailsModal"; // Import the modal component
import './productStock.css'
import axios from "axios";
import altImg from '../../../assets/avater.jpg'
// import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  document.title = "Estarch | Product Stock List";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [count, SetCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [stockLoading, setStockLoading] = useState(true)
  const [totalStock, setTotalStock] = useState(0)
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0)
  const [totalRegularPrice, setTotalRegularPrice] = useState(0)
  const [totalSalePrice, setTotalSalePrice] = useState(0)
  const [totalWholeSalePrice, setTotalWholeSalePrice] = useState(0)
  const [totalOspPricePrice, setTotalOspPricePrice] = useState(0)
  const [categories, setCategories] = useState([]);
  const [CategoryName, SetCategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, SetSubcategoryName] = useState('');
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');




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



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const fetchData = () => {
    setLoading(true)
    fetch(`${baseUrl}/api/products/products?page=${currentPage}&size=${limit}&search=${search}&category=${CategoryName}&subcategory=${subcategoryName}&brand=${brandName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products);
        SetCount(data.totalProducts)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)

        setLoading(false)

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false)
      });

    setStockLoading(true)
    fetch(`${baseUrl}/api/products/total-stock`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTotalStock(data.totalStock);
        setTotalRegularPrice(data.totalRegularPrice)
        setTotalSalePrice(data.totalSalePrice)
        setTotalWholeSalePrice(data.totalWholesalePrice)
        setTotalOspPricePrice(data.totalOspPrice)
        setTotalPurchasePrice(data.totalPurchasePrice)
        setStockLoading(false)

      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setStockLoading(false)
      });
  };

  useEffect(() => {
    fetchData();
  }, [limit, search, currentPage, CategoryName, subcategoryName, brandName]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
  }, []);


  const handleBrandNameChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleCategoryNameChange = (e) => {
    SetCategoryName(e.target.value);
  };

  const handleSubcategoryNameChange = (e) => {
    SetSubcategoryName(e.target.value);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Product Stock List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Product Stock List
            </p>
            {/* Status Summary Cards */}
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-6 my-8">
              <div className="shadow-md cursor-pointer text-center py-2 bg-[#ff7e3e1d]">
                <p className="font-semibold text-[#FF7F3E]">Total Stock</p>
                <p className="text-2xl font-bold text-[#FF7F3E]">  {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalStock} </p>
              </div>

              <div className="shadow-md cursor-pointer text-center py-2 bg-[#af47d223]">
                <p className="font-semibold text-[#AF47D2]">Total Purchase Price</p>
                <p className="text-2xl font-bold text-[#AF47D2]"> {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalPurchasePrice} ৳</p>
              </div>


              <div className="shadow-md cursor-pointer text-center py-2 bg-[#1b424225]">
                <p className="font-semibold text-[#1B4242]">Total Regular Price</p>
                <p className="text-2xl font-bold text-[#1B4242]"> {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalRegularPrice} ৳</p>
              </div>

              <div className="shadow-md cursor-pointer text-center py-2 bg-[#40a57821]">
                <p className="font-semibold text-[#40A578]">Total Sale Price</p>
                <p className="text-2xl font-bold text-[#40A578]"> {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalSalePrice} ৳</p>
              </div>

              <div className="shadow-md cursor-pointer text-center py-2 bg-[#ff204d2a]">
                <p className="font-semibold text-[#FF204E]">Total WholeSale Price</p>
                <p className="text-2xl font-bold text-[#FF204E]"> {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalWholeSalePrice} ৳</p>
              </div>

              <div className="shadow-md cursor-pointer text-center py-2 bg-[#620c9f21]">
                <p className="font-semibold text-[#610C9F]">Total OSP Price</p>
                <p className="text-2xl font-bold text-[#610C9F]"> {stockLoading ? <span className="loading loading-spinner loading-sm"></span> : totalOspPricePrice} ৳</p>
              </div>


            </div>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>

                    <div className='flex justify-between items-center '>
                      <select
                        onChange={(e) => setLimit(e.target.value)}
                        name="" id="" className=' select select-bordered'>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                      </select>
                      <select value={brandName} onChange={handleBrandNameChange} className='select select-bordered ' id="">
                        <option value="">Select Brand Name</option>
                        {brands.map(item => (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>

                      <select value={CategoryName} onChange={handleCategoryNameChange} className='select select-bordered ' id="">
                        <option value="">Select Category Name</option>
                        {categories.map(item => (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>

                      <select value={subcategoryName} onChange={handleSubcategoryNameChange} className='select select-bordered' id="">
                        <option value="">Select Subcategory Name</option>
                        {subcategories.map(item => (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <label className="input input-bordered w-full max-w-xs flex items-center gap-2">
                        <input onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} type="text" className="grow w-full max-w-sm" placeholder="Search" />
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

                    {
                      loading ? <div className="mx-auto flex gap-4">
                        <span className="loading loading-bars loading-xs"></span>
                        <span className="loading loading-bars loading-sm"></span>
                        <span className="loading loading-bars loading-md"></span>
                        <span className="loading loading-bars loading-lg"></span>
                      </div> :
                        <div className="overflow-x-auto overflow-y-hidden">
                          <table className="table">
                            {/* head */}
                            <thead>
                              <tr>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Serial</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Image</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Product Info</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Total Purchase Price</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Total Regular Price</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Total Sale Price</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Total WholeSale Price</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Total OSP Price</th>
                                <th className={`border-2 border-gray-200 border-opacity-75`}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                products.map((item, index) => {
                                  // Calculate total regular price by summing up all regular prices in sizeDetails
                                  const totalQuantity = item.sizeDetails?.reduce((acc, sizeDetail) => acc + sizeDetail?.openingStock, 0) || 0;
                                  const totalRegularPrice = item.sizeDetails?.reduce((acc, sizeDetail) => {
                                    const priceForSize = sizeDetail?.regularPrice * sizeDetail?.openingStock || 0;
                                    return acc + priceForSize;
                                  }, 0) || 0;
                                  const totalSellingPrice = item.sizeDetails?.reduce((acc, sizeDetail) => {
                                    const priceForSize = sizeDetail?.salePrice * sizeDetail?.openingStock || 0;
                                    return acc + priceForSize;
                                  }, 0) || 0;

                                  const totalPurchasePrice = item.sizeDetails?.reduce((acc, sizeDetail) => {
                                    const priceForSize = sizeDetail?.purchasePrice * sizeDetail?.openingStock || 0;
                                    return acc + priceForSize;
                                  }, 0) || 0;

                                  const totalWholeSalePrice = item.sizeDetails?.reduce((acc, sizeDetail) => {
                                    const priceForSize = sizeDetail?.wholesalePrice * sizeDetail?.openingStock || 0;
                                    return acc + priceForSize;
                                  }, 0) || 0;

                                  const totalOSPPrice = item.sizeDetails?.reduce((acc, sizeDetail) => {
                                    const priceForSize = sizeDetail?.ospPrice * sizeDetail?.openingStock || 0;
                                    return acc + priceForSize;
                                  }, 0) || 0;


                                  return (
                                    <tr key={item._id}>
                                      <td className={`border-2 border-gray-200 border-opacity-75`}>{index + 1}</td>
                                      <td className={`border-2 border-gray-200 border-opacity-75`}>
                                        <div className="w-12 flex justify-center">
                                          <div className="flex justify-center">
                                            <img
                                              className=""
                                              src={item.images[0] ? `${baseUrl}/${item.images[0]}` : altImg}
                                              alt='Product images'
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td className={`border-2 border-gray-200 border-opacity-75`}>
                                        <div className="w-44 p-0">
                                          <p><span className="font-bold">Name:</span> <span>{item.productName}</span></p>
                                          <p><span className="font-bold">Sku:</span> <span>{item.SKU}</span></p>
                                          <p><span className="font-bold">Total Stock:</span> <span>{totalQuantity}</span></p>
                                        </div>
                                      </td>
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{totalPurchasePrice} ৳</td> {/* Display total regular price */}
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{totalRegularPrice} ৳</td>
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{totalSellingPrice} ৳</td>
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{totalWholeSalePrice} ৳</td>
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{totalOSPPrice} ৳</td>
                                      <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>
                                        <button
                                          className="btn btn-sm btn-accent text-white"
                                          onClick={() => {
                                            setSelectedProduct(item);
                                            toggleModal();
                                          }}
                                        >
                                          Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                            </tbody>

                          </table>
                        </div>
                    }

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
        </Container>
      </div>
      <ProductDetailsModal isOpen={isModalOpen} toggle={toggleModal} product={selectedProduct} />
    </React.Fragment>
  );
};

export default ProductList;
