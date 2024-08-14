import React, { useState } from 'react';
import baseUrl from '../../../helpers/baseUrl';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ setPaymentModalVisible, userInfo, orderItems, discount, calculateTotalAmount, finalAmount }) => {
  const navigate = useNavigate();
  const [deliveryLocation, setDeliveryLocation] = useState('inside');
  const [orderNote, setOrderNote] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const getDeliveryAmount = () => {
    return deliveryLocation === 'inside' ? 60 : 120;
  };

  const discountAmount = discount.type === 'percentage' ? (calculateTotalAmount() * discount.value) / 100 : discount.value;
  const grandTotalAmount = finalAmount() - discountAmount + getDeliveryAmount();

  const orderData = {
    serialId: 'E-commerce',
    name: userInfo.name,
    phone: userInfo.phone,
    deliveryCharge: getDeliveryAmount(),
    address: `${userInfo.address}, ${selectedDistrict}`,
    orderNotes: orderNote,
    cartItems: orderItems.map(item => ({
      productId: item._id,
      title: item.productName,
      quantity: item.quantity,
      price: item.sellingPrice,
      size: item.size,
    })),
    paymentMethod: 'Cash on Delivery',
    totalAmount: calculateTotalAmount(),
    userId: null,
    discount: discountAmount,
    grandTotal: grandTotalAmount,
    note: customerNote,
    district:selectedDistrict,
    area:deliveryLocation
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Order placed successfully!');
        navigate(`/invoice/${responseData.order._id}`)
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
            <p className="mb-4"><strong>Address:</strong> {userInfo.address}, {selectedDistrict}</p>

            <h3 className="text-xl font-semibold mb-2">Order List</h3>
            <table className="w-full mb-4 text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2">Product</th>
                  <th className="border-b py-2">Quantity</th>
                  <th className="border-b py-2">Price (TK)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border-b py-2">{item.productName} ({item.size})</td>
                    <td className="border-b py-2">{item.quantity}</td>
                    <td className="border-b py-2">{item.afterDiscount * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mb-2"><strong>Total Amount:</strong> {calculateTotalAmount()} TK</p>
            <p className="mb-2"><strong>Discount:</strong> {discount.value} {discount.type === 'percentage' ? '%' : 'TK'}</p>
            <p className="mb-2"><strong>Delivery Amount:</strong> {getDeliveryAmount()} TK</p>
            <p className="mb-4"><strong>Final Amount:</strong> {grandTotalAmount} TK</p>
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
              <label className="block text-sm font-bold mb-2" htmlFor="district">District</label>
              <select
                className="w-full p-2 border rounded"
                id="district"
                name="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                required
              >
                <option value="">Select District</option>
                <option value="Barisal">Barisal</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Khulna">Khulna</option>
                <option value="Mymensingh">Mymensingh</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Sylhet">Sylhet</option>
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
