import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MDBDataTable } from "mdbreact";
import { MdDeleteSweep } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import baseUrl from "../../../helpers/baseUrl";
import { BsThreeDotsVertical } from "react-icons/bs";
import ProductDetailsModal from "./ProductDetailsModal"; // Import the modal component
import "./productDetails.css"; // Import the CSS file
import BarcodePrintModal from "./BarcodePrintModal";
import { Link } from "react-router-dom";
import axios from "axios";
import './productList.css'
import altImg from '../../../assets/avater.jpg'

// import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  document.title = "Estarch | Product List";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [count, SetCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
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


  const toggleBarcodeModal = () => {
    setIsBarcodeModalOpen(!isBarcodeModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const updateSize = (p_id, s_id) => {
    axios.put(`${baseUrl}/api/products/toggle-size-availability`, { "productId": p_id, "sizeDetailId": s_id })
      .then(res => {
        alert("success");
        // Optionally refresh or update the data here
        fetchData()
      });
  };

  const updateOtherToggle = (p_id, name) => {
    axios.put(`${baseUrl}/api/products/product/toggle/${p_id}/${name}`)
      .then(res => {
        // Refresh or update the data after successful update
        console.log(res.data.message);

        alert(res.data.message);
        // Fetch data again to reflect the changes
        fetchData();
      });
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
          <Breadcrumbs title="Estarch" breadcrumbItem="Product List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Product List
            </p>
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
                          <table className="table table-zebra">
                            {/* head */}
                            <thead>
                              <tr>
                                <th className="border-1 border-gray-200 border-opacity-75">Image</th>
                                <th className="border-1 border-gray-200 border-opacity-75">Product Info</th>
                                <th className="border-1 border-gray-200 border-opacity-75">SKU</th>
                                <th className="border-1 border-gray-200 border-opacity-75">Toggle-Size-Barcode-Stock</th>
                                <th className="border-1 border-gray-200 border-opacity-75">Others info</th>
                                <th className="border-1 border-gray-200 border-opacity-75">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                products.map(item =>
                                  <tr key={item._id}>
                                    <td className="border-1 border-gray-200 border-opacity-75">
                                      <div className="w-12 flex justify-center">
                                        <div className="flex justify-center">
                                          <img
                                            src={item.images[0] ? `${baseUrl}/${item.images[0]}` : altImg}
                                            alt='Product images'
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border-1 border-gray-200 border-opacity-75">
                                      <div className="w-44 p-0">
                                        <p><span className="font-bold">Name:</span> <span>{item.productName}</span></p>
                                        <p><span className="font-bold">Type:</span> <span>{item.selectedType}</span></p>
                                        <p><span className="font-bold">Category:</span> <span>{item.selectedCategoryName}</span></p>
                                        <p><span className="font-bold">SubCategory:</span> <span>{item.selectedSubCategory}</span></p>
                                        <p><span className="font-bold">Brand:</span> <span>{item.selectedBrand}</span></p>
                                      </div>
                                    </td>
                                    <td className="border-1 border-gray-200 border-opacity-75"><p><span className="font-bold">Sku:</span> <span>{item.SKU}</span></p></td>
                                    <td className="border-1 border-gray-200 border-opacity-75">
                                      <div className="space-y-2">
                                        {
                                          item.sizeDetails.map(s =>
                                            <div key={s._id} className="flex justify-center items-center gap-1">
                                              <input onClick={() => updateSize(item._id, s._id)} type="checkbox" className="toggle toggle-info toggle-sm" checked={s.available ? true : false} />
                                              <p className="flex items-center gap-2"><span className="bg-base-300 px-2 rounded-md">{s.size}</span><span className="text-success">{s.barcode} =</span><span>{s.openingStock}</span></p>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </td>
                                    <td className="border-1 border-gray-200 border-opacity-75">
                                      <div className="space-y-2 ">
                                        <div onClick={() => updateOtherToggle(item._id, "productStatus")} className="flex flex-wrap gap-2 cursor-pointer">
                                          <p className={`bg-${item.productStatus === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                                            Status
                                          </p>
                                          <input type="checkbox" className="toggle toggle-info" checked={item.productStatus === true ? true : false} />
                                        </div>
                                        <div onClick={() => updateOtherToggle(item._id, "posSuggestion")} className="flex flex-wrap gap-2 cursor-pointer">
                                          <p className={`bg-${item.posSuggestion === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                                            Pos Suggestion
                                          </p>
                                          <input type="checkbox" className="toggle toggle-info" checked={item.posSuggestion !== true ? false : true} />
                                        </div>
                                        <div onClick={() => updateOtherToggle(item._id, "showSize")} className="flex flex-wrap gap-2 cursor-pointer">
                                          <p className={`bg-${item.showSize === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                                            Show Size
                                          </p>
                                          <input type="checkbox" className="toggle toggle-info" checked={item.showSize === true ? true : false} />
                                        </div>
                                        <div onClick={() => updateOtherToggle(item._id, "featureProduct")} className="flex flex-wrap gap-2 cursor-pointer">
                                          <p className={`bg-${item.featureProduct === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                                            Feature
                                          </p>
                                          <input type="checkbox" className="toggle toggle-info" checked={item.featureProduct === true ? true : false} />
                                        </div>
                                        <div onClick={() => updateOtherToggle(item._id, "freeDelevary")} className="flex flex-wrap gap-2 cursor-pointer">
                                          <p className={`bg-${item.freeDelevary === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                                            Free Delivery
                                          </p>
                                          <input type="checkbox" className="toggle toggle-info" checked={item.freeDelevary === true ? true : false} />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border-1 border-gray-200 border-opacity-75">
                                      <div className="dropdown flex justify-center ">
                                        <div tabIndex={0} role="button" className="btn m-1 btn-sm"><BsThreeDotsVertical /></div>
                                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[10000]  p-2 shadow space-y-2">
                                          <li>
                                            <button
                                              className="btn btn-xs btn-accent text-white"
                                              onClick={() => {
                                                setSelectedProduct(item);
                                                toggleModal();
                                              }}
                                            >
                                              Details
                                            </button>
                                          </li>
                                          <li><Link target="_blank" to={`/ecommerce-edit-product/${item._id}`} className="btn btn-xs bg-base-100 shadow-none border-none text-success text-xl"><FaEdit /></Link></li>
                                          <li><p className="btn btn-xs text-error text-xl bg-base-100 border-none shadow-none"><MdDeleteSweep /></p></li>
                                          <li><button onClick={() => {
                                            setSelectedProduct(item);
                                            toggleBarcodeModal();
                                          }} className="btn btn-xs text-white btn-primary">Print</button></li>
                                        </ul>
                                      </div>
                                    </td>
                                  </tr>
                                )
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
      <BarcodePrintModal isOpen={isBarcodeModalOpen} toggle={toggleBarcodeModal} product={selectedProduct} />
    </React.Fragment>
  );
};

export default ProductList;
