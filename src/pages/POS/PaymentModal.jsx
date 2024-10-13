import { useEffect, useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { TbTrash } from 'react-icons/tb';
import baseUrl from '../../helpers/baseUrl';

const PaymentModal = ({ setPaymentModalVisible, finalAmount, userInfo, orderItems, discount, exchangeDetails, exchangeAmount }) => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, accountType: 'mobilebank', paymentOption: '', accountNumber: '', amount: 0 },
  ]);
  const [accounts, setAccounts] = useState([]); // Store the accounts data
  const [deliveryLocation, setDeliveryLocation] = useState('inside');
  const [orderNote, setOrderNote] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [orderSource, setOrderSource] = useState('Store');
  // Fetch accounts data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/payment/online-accounts`);
        const data = await response.json();
        if (data && data.length > 0) {
          setAccounts(data[0].accounts); // Assuming "accounts" is inside the first object
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []);
  // Handle the account type selection
  const handleAccountTypeChange = (id, value) => {
    // Find payment options for the selected account type
    const selectedAccount = accounts.find((acc) => acc.accountType === value);
    const paymentOptions = selectedAccount ? selectedAccount.payments : [];

    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, accountType: value, paymentOption: '', accountNumber: '', paymentOptions } // Reset paymentOption and set new options
          : payment
      )
    );
  };
  const getDeliveryAmount = () => {
    return deliveryLocation === 'inside' ? 60 : 120;
  };
  const addPaymentRow = () => {
    const newPayment = { id: Date.now(), accountType: '', paymentOption: '', amount: '', paymentOptions: [] };
    setPayments([...payments, newPayment]);
  };

  const removePaymentRow = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => {
        if (payment.id === id) {
          if (field === 'paymentOption') {
            // Find the selected account and payment option details
            const selectedAccount = accounts.find((acc) => acc.accountType === payment.accountType);
            const selectedPaymentOption = selectedAccount?.payments.find((opt) => opt.paymentOption === value);
            const accountNumber = selectedPaymentOption?.accountNumber || '';

            // Update payment option and set the corresponding account number
            return { ...payment, paymentOption: value, accountNumber };
          }
          // For other fields, simply update the value
          return { ...payment, [field]: value };
        }
        return payment;
      })
    );
  };

  const productDiscount = () => {
    return orderItems.reduce((acc, item) => {
      const itemTotal = (item.discountAmount) * item.quantity;
      return acc + itemTotal;
    }, 0);
  };
  const totalAmount = payments.reduce(
    (acc, payment) => acc + Number(payment.amount || 0),
    0
  );
  const calculateTotalAmount = () => orderItems.reduce((total, item) => total + item.salePrice * item.quantity, 0) - exchangeAmount;
  const discountAmount = discount.type === 'percentage' ? (calculateTotalAmount() * discount.value) / 100 : discount.value;
  const totalDiscount = discount.type === 'percentage' ? finalAmount * discount.value / 100 : discount.value
  const grandTotalAmount = calculateTotalAmount() - discountAmount + getDeliveryAmount();
  const dueAmount = grandTotalAmount - totalAmount;
  const totalOrderDiscount = orderItems.reduce((acc, item) => acc + item.discountAmount * item.quantity, 0);

  const handleCheckOut = async () => {
    setLoading(true);
    const userIdString = localStorage.getItem('userId');
    const userId = JSON.parse(userIdString);
    // const orderData = {
    //   serialId: orderSource,
    //   name: userInfo.name,
    //   phone: userInfo.phone,
    //   deliveryCharge: 0,
    //   address: userInfo.address,
    //   orderNotes: '',
    //   cartItems: orderItems.map((item) => ({
    //     productId: item.productId,
    //     title: item.productName,
    //     quantity: item.quantity,
    //     price: item.salePrice,
    //     discountAmount: item.discountAmount,
    //     size: item.size,
    //   })),
    //   paymentMethod: 'Cash on Delivery',
    //   totalAmount: finalAmount,
    //   userId: null,
    //   discount: Number(totalDiscount) + Number(totalOrderDiscount),
    //   grandTotal: finalAmount,
    //   advanced: totalAmount,
    //   dueAmount: 0,
    //   note: '',
    //   area: '',
    //   manager: userId,
    //   payments,
    //   exchangeAmount,
    //   exchangeDetails
    // };
    const orderData = {
      serialId: orderSource,  // Set based on selected order source
      name: userInfo.name,
      phone: userInfo.phone,
      deliveryCharge: getDeliveryAmount(),
      address: `${userInfo.address}`,
      orderNotes: orderNote,
      adminDiscount: discountAmount,
      cartItems: orderItems.map(item => ({
        productId: item.productId,
        title: item.productName,
        quantity: item.quantity,
        price: item.salePrice,
        discountAmount:item.discountAmount ,
        size: item.size,
      })),
      paymentMethod: 'Cash on Delivery',
      totalAmount: calculateTotalAmount(),
      userId: null,
      discount: productDiscount(),
      grandTotal: grandTotalAmount,
      advanced: totalAmount,  
      dueAmount,  
      note: customerNote,
      area: deliveryLocation,
      manager: userId,
      payments,
      exchangeAmount,
      exchangeDetails
    };
    console.log(orderData);
    
    try {
      const response = await fetch(`${baseUrl}/api/orders/online-pos-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        const responseData = await response.json();
        alert('Order placed successfully!');
        window.location.href = `/ecommerce-orders`;
      } else {
        console.error('There was an error placing the order:', response);
      }
    } catch (error) {
      console.error('There was an error placing the order:', error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }

  };
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setPaymentModalVisible(false);
    }
    else if (event.key === "Enter") {
      handleCheckOut();
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  console.log(payments);

  return (
    <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white min-h-4/6 fixed top-6 rounded-lg shadow-lg p-6 w-full max-w-7xl h-fit ">
        <div className="flex space-x-6">
          {/* Payment Details Section */}
          <div className="w-1/3 text-lg bg-gray-100 p-2 rounded">
            <h3 className="font-bold mb-2">User Details</h3>
            <table className="table-auto w-full mb-4">
              <thead>
                <tr>
                  <th className="text-left text-sm border-b  pr-4">Name</th>
                  <th className="text-left text-sm border-b  pr-4">Phone</th>
                  <th className="text-left text-sm border-b  pr-4">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border-b text-sm '>{userInfo.name}</td>
                  <td className='border-b text-sm '>{userInfo.phone}</td>
                  <td className='border-b text-sm '>{userInfo.address}</td>
                </tr>
              </tbody>
            </table>

            <h3 className=" font-semibold my-2">Order List</h3>
            <table className="w-full text-[12px] mb-4 text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2">Product</th>
                  <th className="border-b py-2">Regular Price</th>
                  <th className="border-b py-2">Discount</th>
                  <th className="border-b py-2">Quantity</th>
                  <th className="border-b py-2">Price (TK)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index} className='bg-white'>
                    <td className="border-b py-2 w-24">{item.productName} ({item.size})</td>
                    <td className="border-b py-2">{item.regularPrice}</td>
                    <td className="border-b py-2">{item.discountAmount}</td>
                    <td className="border-b py-2">{item.quantity}</td>
                    <td className="border-b py-2">{item.salePrice * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="font-bold mb-2">Payment Details</h3>
            <table className="table-auto w-full text-sm">
              <tbody>
                <tr className='border-b'>
                  <td className="py-1">Total Amount:</td>
                  <td className="text-right">{calculateTotalAmount() + totalOrderDiscount}TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Product Discount:</td>
                  <td className="text-right">- {productDiscount()}TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">After Product Discount:</td>
                  <td className="text-right">{calculateTotalAmount()}TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Admin Discount:</td>
                  <td className="text-right"> - {discount.value} {discount.type === 'percentage' ? '%' : 'TK'}</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Delivery Amount:</td>
                  <td className="text-right">{getDeliveryAmount()} TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Grand Total:</td>
                  <td className="text-right">{grandTotalAmount} TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Advance Payment:</td>
                  <td className="text-right">{totalAmount} TK</td>
                </tr>
                <tr className='border-b'>
                  <td className="py-1">Due Amount:</td>
                  <td className="text-right">{dueAmount} TK</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Payment Type Section */}
          <div className="w-2/3 space-y-4">
            <div className='h-[400px] overflow-y-scroll'>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Delivery Location</label>
                <select
                  className="w-full p-2 border rounded"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                >
                  <option value="inside">Inside Dhaka</option>
                  <option value="outside">Outside Dhaka</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Order Source</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value)}
                >
                  <option value="Store">Store</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="E-commerce">E-commerce</option>
                </select>

              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Order Note</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="4"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Customer's Note</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="4"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className='max-h-40 overflow-y-scroll mt-5 w-full'>
              {payments?.map((payment) => (
                <div className="grid grid-cols-5 gap-4 mb-2" key={payment.id}>
                  {/* Payment Type */}
                  <div className="col-span-1">
                    <select
                      className="w-full p-2 border rounded"
                      value={payment.accountType}
                      onChange={(e) => handleAccountTypeChange(payment.id, e.target.value)}
                    >
                      <option value="">Select Account Type</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account.accountType}>
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Option */}
                  <div className="col-span-1">
                    <select
                      className="w-full p-2 border rounded"
                      value={payment.paymentOption}
                      onChange={(e) => handleInputChange(payment.id, 'paymentOption', e.target.value)}
                    >
                      <option value="">Account option</option>
                      {payment?.paymentOptions?.map(option => (
                        <option key={option._id} value={option.paymentOption}>
                          {option.paymentOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="col-span-1">
                    <input
                      type="text"
                      disabled
                      placeholder="accountNumber"
                      value={payment.accountNumber}
                      onChange={(e) => handleInputChange(payment.id, 'accountNumber', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={payment.amount}
                      onChange={(e) => handleInputChange(payment.id, 'amount', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-1 flex items-center space-x-2">
                    <button className="text-blue-500 p-2" onClick={addPaymentRow}>
                      <PiPlus />
                    </button>
                    {payments.length > 1 && (
                      <button
                        className="text-red-500 p-2"
                        onClick={() => removePaymentRow(payment.id)}
                      >
                        <TbTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 gap-5">
              <button onClick={() => setPaymentModalVisible(false)} className="bg-red-500 text-white px-6 py-2 rounded w-full">
                Cancel [Esc]
              </button>
              <button
                className={`bg-green-500 text-white px-6 py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCheckOut}
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
