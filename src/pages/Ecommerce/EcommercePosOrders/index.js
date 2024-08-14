import React, { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import SizeModal from "./SizeModal";
import baseUrl from "../../../helpers/baseUrl";
import { IoPlayBackCircleSharp } from "react-icons/io5";
import './pos.css'
import FullScreenButton from "../../../components/Common/FullScreenButton";
import { Link } from "react-router-dom";
import Modal from "./modal";
import { fetchBrands, fetchCategories, fetchSubCategories } from "../../../utils/categoryApi";
import PaymentModal from "./PaymentModal";
const PosOrders = () => {
  document.title = "Estarch | Pos Orders";
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brand: '', category: '', subcategory: '', search: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [userInfo, setUserInfo] = useState({
    phone: '',
    name: '',
    address: ''
  });
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);


  const fetchUserData = async (phone) => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/orders/${phone}`);
      const userData = await response.json();

      if (userData) {
        console.log(userData);

        setUserInfo({
          phone: userData.phone,
          name: userData.name,
          address: userData.address,
        });

        setOrders(userData.orderList || []);

        // Log the updated state after it's set
        console.log("Updated Orders:", userData.orderList);
        console.log("Updated UserInfo:", {
          phone: userData.phone,
          name: userData.name,
          address: userData.address,
        });

      } else {
        // Handle case where user is not found
        setUserInfo({ phone: '', name: '', address: '' });
        setOrders([]); // Clear orders if user is not found
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUserInfoChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Fetch user data when phone number changes
      await fetchUserData(value);
    }

    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };


  useEffect(() => {
    fetchProducts();
  }, [filters]);
  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setFilteredCategories(data);
    };
    getCategories();
    const getBrands = async () => {
      const data = await fetchBrands();
      setBrands(data);
      setFilteredBrands(data);
    };
    getBrands();
    const getSubCategories = async () => {
      const subCategoryData = await fetchSubCategories();
      console.log(subCategoryData);
      setSubCategories(Array.isArray(subCategoryData) ? subCategoryData : []);
      setFilteredSubCategories(Array.isArray(subCategoryData) ? subCategoryData : []);
    };
    getSubCategories();
  }, []);


  // Handle payment button click
  const handlePaymentClick = () => {
    setPaymentModalVisible(true);
  };


  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce((e, type) => {
    const searchTerm = e.target.value.toLowerCase();
    if (type === 'Brand') {
      setFilteredBrands(brands.filter(brand => brand.name.toLowerCase().includes(searchTerm)));
    } else if (type === 'Category') {
      setFilteredCategories(categories.filter(category => category.name.toLowerCase().includes(searchTerm)));
    } else if (type === 'Sub Category') {
      setFilteredSubCategories(subCategories.filter(subCategory => subCategory.name.toLowerCase().includes(searchTerm)));
    }
  }, 300);


  const fetchProducts = async () => {
    let query = new URLSearchParams(filters).toString();
    const response = await fetch(`${baseUrl}/api/products/products-for-pos?${query}`);
    const data = await response.json();
    setProducts(data);
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  const handleFilterSelect = (type, value) => {
    setFilters(prevFilters => ({
      // ...prevFilters,
      [type.toLowerCase()]: value,
    }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleSizeSelect = (size) => {
    const { _id, ...sizeData } = selectedProduct.sizeDetails.find((detail) => detail.size === size);
    setOrderItems([
      ...orderItems,
      {
        ...selectedProduct,
        ...sizeData,
        size,
        quantity: 1,
        discountPercent: 0,
        discountAmount: 0
      }
    ]);
    setModalVisible(false);
    setSelectedProduct(null);
  };


  const handleQuantityChange = (index, increment) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity = Math.max(1, newOrderItems[index].quantity + increment);
    setOrderItems(newOrderItems);
  };

  const handleDiscountChange = (index, field, value) => {
    setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
    const newOrderItems = [...orderItems];
    newOrderItems[index][field] = parseFloat(value) || 0;

    if (field === 'discountPercent') {
      newOrderItems[index].discountAmount = (newOrderItems[index].sellingPrice * newOrderItems[index].discountPercent) / 100;
    } else {
      newOrderItems[index].discountPercent = (newOrderItems[index].discountAmount / newOrderItems[index].sellingPrice) * 100;
    }

    newOrderItems[index].afterDiscount = newOrderItems[index].sellingPrice - newOrderItems[index].discountAmount;
    setOrderItems(newOrderItems);
  };

  const clearDiscounts = () => {
    const newOrderItems = orderItems.map(item => ({
      ...item,
      discountPercent: 0,
      discountAmount: 0,
      afterDiscount: item.sellingPrice
    }));
    setOrderItems(newOrderItems);
  };

  const handleDelete = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleTypeChange = (e) => {
    const totalDiscount = orderItems.reduce((total, item) => total + item.discountAmount * item.quantity, 0);
    if (totalDiscount > 0) {
      alert("please clear discount");
      setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
    } else {
      setDiscount((prevDiscount) => ({ ...prevDiscount, type: e.target.value }));
    }
  };

  const handleValueChange = (e) => {
    const totalDiscount = orderItems.reduce((total, item) => total + item.discountAmount * item.quantity, 0);
    if (totalDiscount > 0) {
      alert("please clear discount");
      setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
    } else {
      setDiscount((prevDiscount) => ({ ...prevDiscount, value: e.target.value }));
    }
  };

  const calculateTotalItems = () => orderItems.reduce((total, item) => total + item.quantity, 0);

  const calculateTotalDiscountAmount = () => orderItems.reduce((total, item) => total + item.discountAmount * item.quantity, 0);

  const calculateTotalAmount = () => orderItems.reduce((total, item) => total + item.afterDiscount * item.quantity - calculateTotalDiscountAmount(), 0);
  const finalAmount = () => {
    if (discount.type === 'percentage') {
      return calculateTotalAmount() - calculateTotalAmount() * parseInt(discount.value) / 100
    } else {
      return calculateTotalAmount() - parseInt(discount.value)
    }
  };
  return (
    <React.Fragment>
      <div className="mt-2">
        <main className="min-h-screen bg-slate-50">
          <div className="flex">
            <div className="w-5/12 flex items-center flex-col px-3">
              <div className="grid grid-cols-2 gap-3 w-full">
                {['Brand', 'Category', 'Subcategory'].map((filter, idx) => (
                  <div key={idx}>
                    <details className="dropdown w-full">
                      <summary className="btn bg-white w-full border flex justify-between">
                        {filter} <MdArrowDropDown />
                      </summary>
                      <ul className="menu w-full dropdown-content bg-base-100 rounded-box z-[1] p-1 shadow">
                        <li>
                          <input
                            type="text"
                            placeholder="Type here"
                            className="input h-8 w-full input-bordered rounded-sm"
                            onChange={(e) => handleSearch(e, filter)}
                          />
                        </li>
                        {(filter === 'Brand' ? filteredBrands : filter === 'Category' ? filteredCategories : filteredSubCategories).map((item) => (
                          <li className="p-2 cursor-pointer hover:bg-slate-400" key={item._id} onClick={() => handleFilterSelect(filter, item.name)}>
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
                <div>
                  <input
                    type="text"
                    placeholder="Enter Product name / SKU"
                    className="input input-bordered w-full max-w-xs"
                    name="search"
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {products?.map((product, index) => (
                  <div
                    key={index}
                    className="cursor-pointer card card-compact bg-base-100 w-[140px] h-[220px] shadow-xl rounded-none mt-2"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="p-2 h-[150px]">
                      <figure>
                        <img
                          className="h-[140px] w-[130px]"
                          src={product.images[0]}
                          alt={product.productName}
                        />
                      </figure>
                    </div>
                    <div className="bg-slate-200 h-[70px] text-sm text-center p-2">
                      <p>SKU:{product.SKU}</p>
                      <p className="text-sm">{product.productName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-7/12 bg-white">
              <div className="container mx-auto px-4 py-2">
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={userInfo.address}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                </div>
                <p className="px-4">
                  {orders?.length > 0 ? 'User found' : 'User not found'}
                  {orders?.length > 0 &&
                    <span
                      className="underline cursor-pointer"
                      onClick={() => document.getElementById('orders_modal').showModal()}

                    >
                      (see order list)
                    </span>
                  }
                </p>
                <table className="min-w-full bg-white px-4">
                  <thead className="bg-green-500 text-white">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Disc(%)</th>
                      <th className="px-4 py-2">Disc Amt</th>
                      <th className="px-4 py-2">After Disc</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="pos-table-scroll" >
                    {orderItems.map((item, index) => (
                      <tr key={index} style={{ height: '50px' }}>
                        <td className="border px-4 py-2 text-[13px]">
                          {item.productName} ({item.size})
                          <br />
                          Barcode: {item.barcode}
                        </td>
                        <td className="border px-4 py-2">{item.sellingPrice}</td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={item.discountPercent}
                            onChange={(e) => handleDiscountChange(index, 'discountPercent', e.target.value)}
                            className="input w-16"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="number"
                            value={item.discountAmount}
                            onChange={(e) => handleDiscountChange(index, 'discountAmount', e.target.value)}
                            className="input w-16"
                          />
                        </td>
                        <td className="border px-4 py-2">{item.afterDiscount}</td>
                        <td className="border px-4 py-2 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={item.quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </td>
                        <td className="border px-4 py-2">{item.afterDiscount * item.quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button onClick={() => handleDelete(index)} className="text-red-500">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orderItems.some(item => item.discountPercent > 0 || item.discountAmount > 0) && (
                  <div className="flex justify-center mt-1">
                    <button
                      onClick={clearDiscounts}
                      className="btn btn-sm w-32 bg-red-600 hover:bg-red-600 text-white font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <div className="mt-14">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{calculateTotalItems()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{calculateTotalAmount()}</span>
                  </div>
                </div>
                <div className="bg-black px-4 text-white grid grid-cols-2 gap-5 p-2">
                  <div className="flex justify-between items-center space-x-2">
                    <div className="flex items-center space-x-2 text-black">
                      <span className="text-white">Disc</span>
                      <select
                        className="border p-1 rounded"
                        value={discount.type}
                        onChange={handleTypeChange}
                      >
                        <option value="percentage">(%)</option>
                        <option value="amount">(amount)</option>
                      </select>
                    </div>
                    <input
                      className="border p-1 rounded w-20 text-black"
                      type="number"
                      value={discount.value}
                      onChange={handleValueChange}
                      placeholder="Value"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>After Discount Price</span>
                    <span>{finalAmount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total VAT</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Payable</span>
                    <span>{finalAmount()}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="sticky bottom-0">
            <div className="mt-3 flex text-center ">
              <div className="bg-[#605ca8] w-7/12 flex justify-evenly">
                <div className="flex items-center h-full justify-evenly gap-10">
                  <Link to='/'><IoPlayBackCircleSharp className="text-4xl  text-white" /></Link>
                  <FullScreenButton />
                </div>

                <p className="text-4xl font-bold py-4 text-white">
                  Total : {finalAmount()} TK
                </p>
              </div>
              <div className="bg-[#188ae2] w-2/12" onClick={() => document.getElementById('my_modal_3').showModal()}>
                <p className="text-4xl font-bold py-4 text-white">
                  Exchange
                </p>
              </div>

              <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <Modal />
                </div>
              </dialog>
              <div className="bg-[#c1793c] w-1/12">
                <p className="text-4xl font-bold py-4 text-white">
                  :::
                </p>
              </div>
              <div className="bg-[#ff890f] w-1/12">
                <p className="text-4xl font-bold py-4 text-white">
                  Hold
                </p>
              </div>
              <div
                className="bg-[#f31250] w-1/12"
                onClick={() => {
                  setOrderItems([]);
                  setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
                }}
              >
                <p className="text-4xl font-bold py-4 text-white">
                  Clear
                </p>
              </div>

              <div className="bg-[#00a65a] w-2/12" onClick={handlePaymentClick}>
                <p className="text-4xl font-bold py-4 text-white">
                  Payment
                </p>
              </div>
            </div>
          </div>
        </main>
        {modalVisible && (
          <SizeModal product={selectedProduct} onSizeSelect={handleSizeSelect} onClose={() => setModalVisible(false)} />
        )}
        {paymentModalVisible && (
          <PaymentModal setPaymentModalVisible={setPaymentModalVisible} userInfo={userInfo} orderItems={orderItems} discount={discount} calculateTotalAmount={calculateTotalAmount} finalAmount={finalAmount} />

        )}

        <dialog id="orders_modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="text-lg font-bold">Previous Orders</h3>
            <table className="min-w-full bg-white px-4">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="border px-4 py-2">{order.invoice}</td>
                    <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{order.grandTotal}</td>
                    <td className="border px-4 py-2">{order.status[0].name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </dialog>


      </div>
    </React.Fragment>
  );
};

export default PosOrders;
