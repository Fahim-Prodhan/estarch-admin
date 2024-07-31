import React from 'react';

export default function Modal() {
  return (
    <div className="flex flex-col items-center justify-center  py-2 ">
      <div className="w-full max-w-6xl p-6 bg-white rounded-md">
        <div className="flex mb-4">
          <div className="w-3/10 pr-2">
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Exchange Details</h2>
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Exchange Product</td>
                    <td className="border px-4 py-2">0</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Exchange Total</td>
                    <td className="border px-4 py-2">0</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Cart Total</td>
                    <td className="border px-4 py-2">0</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Difference</td>
                    <td className="border px-4 py-2">0</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Invoice No</td>
                    <td className="border px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
          <div className="w-full pl-2">
            <div className='flex items-center justify-center'>
            <input
              type="text"
              placeholder="Enter Full Invoice No"
              className="w-[600px]  p-2 border border-gray-300 rounded"
            />
           </div>
            <div className="overflow-x-auto mt-10">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-purple-500 text-white">Product Name</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Qty</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Price</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Total</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Action</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td className="border px-4 py-2">Example Product</td>
                    <td className="border px-4 py-2">1</td>
                    <td className="border px-4 py-2">$10.00</td>
                    <td className="border px-4 py-2">$10.00</td>
                    <td className="border px-4 py-2">Action</td>
                  </tr>
                </tbody>
              </table>
            </div>
           
          </div>

        </div>
        <div className="flex justify-center ml-40 mt-4">
              <button className="w-96 p-2 mr-2 text-white bg-red-500 rounded">
                Clear Exchange
              </button>
              <button className="w-96 p-2 ml-2 text-white bg-green-500 rounded">
                Continue
              </button>
            </div>
      </div>
      
    </div>
  );
}