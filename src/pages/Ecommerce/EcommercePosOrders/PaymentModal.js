import React, { useState } from 'react';
import baseUrl from '../../../helpers/baseUrl';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ setPaymentModalVisible, userInfo, orderItems, discount, calculateTotalAmount, finalAmount }) => {
  const navigate = useNavigate();
  const [deliveryLocation, setDeliveryLocation] = useState('inside');
  const [orderNote, setOrderNote] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [advancePayment, setAdvancePayment] = useState(0);
  const [orderSource, setOrderSource] = useState('Store');

  const getDeliveryAmount = () => {
    return deliveryLocation === 'inside' ? 60 : 120;
  };

  const discountAmount = discount.type === 'percentage' ? (calculateTotalAmount() * discount.value) / 100 : discount.value;
  
  const productDiscount = () => {
    return orderItems.reduce((acc, item) => {
      const itemTotal = (item.discountAmount) * item.quantity;
      return acc + itemTotal;
    }, 0);
  };

  
  const grandTotalAmount = calculateTotalAmount()- discountAmount + getDeliveryAmount();
  const dueAmount = grandTotalAmount - advancePayment;

  const orderData = {
    serialId: orderSource,  // Set based on selected order source
    name: userInfo.name,
    phone: userInfo.phone,
    deliveryCharge: getDeliveryAmount(),
    address: `${userInfo.address}`,
    orderNotes: orderNote,
    adminDiscount: discountAmount,
    cartItems: orderItems.map(item => ({
      productId: item._id,
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
    advanced: advancePayment,  
    dueAmount,  
    note: customerNote,
    area: deliveryLocation,
  };

  const handleSave = async () => {
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
        navigate(`/ecommerce-orders`);
        console.log(responseData);
      } else {
        console.error('There was an error placing the order:', response.statusText);
      }
    } catch (error) {
      console.error('There was an error placing the order:', error);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="modal-content relative bg-white rounded-lg shadow-lg px-6 py-10 w-full max-w-6xl">
        <button
          onClick={() => setPaymentModalVisible(false)}
          className="absolute top-4 right-4 text-black text-2xl btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
            <p className="mb-2"><strong>Name:</strong> {userInfo.name}</p>
            <p className="mb-2"><strong>Phone:</strong> {userInfo.phone}</p>
            <p className="mb-4"><strong>Address:</strong> {userInfo.address}</p>

            <h3 className="text-xl font-semibold mb-2">Order List</h3>
            <table className="w-full mb-4 text-left border-collapse">
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
                  <tr key={index}>
                    <td className="border-b py-2">{item.productName} ({item.size})</td>
                    <td className="border-b py-2">{item.regularPrice}</td>
                    <td className="border-b py-2">{item.discountAmount}</td>
                    <td className="border-b py-2">{item.quantity}</td>
                    <td className="border-b py-2">{item.salePrice * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mb-2"><strong>Total Bill:</strong> {calculateTotalAmount() + productDiscount()} TK</p>
            <p className="mb-2"><strong>Product Discount:</strong> {productDiscount()} TK</p>
            <p className="mb-2"><strong>After Product Discount:</strong> {calculateTotalAmount()} TK</p>
            <p className="mb-2"><strong>Admin Discount:</strong> {discount.value} {discount.type === 'percentage' ? '%' : 'TK'}</p>
            <p className="mb-2"><strong>Delivery Amount:</strong> {getDeliveryAmount()} TK</p>
            <p className="mb-4"><strong>Grand Total:</strong> {grandTotalAmount} TK</p>
            <p className="mb-2"><strong>Advance Payment:</strong> {advancePayment} TK</p>
            <p className="mb-2"><strong>Due Amount:</strong> {dueAmount} TK</p>
          </div>

          <div>
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
              <label className="block font-semibold mb-2">Advance Payment</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
              />
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

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
