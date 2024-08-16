import React, { useState } from 'react';
const HomeView = () => {
    // State for toggles
    const [webFlash, setWebFlash] = useState(true);
    const [webFeature, setWebFeature] = useState(true);
    const [webArrival, setWebArrival] = useState(true);
    const [webBestDeal, setWebBestDeal] = useState(true);
    const [webJeans, setWebJeans] = useState("jeans");
    const [webTshirt, setWebTshirt] = useState("t-shirt");
  
    const [mobileFlash, setMobileFlash] = useState(true);
    const [mobileFeature, setMobileFeature] = useState(true);
    const [mobileArrival, setMobileArrival] = useState(true);
    const [mobileBestDeal, setMobileBestDeal] = useState(true);
    const [mobileJeans, setMobileJeans] = useState("jeans");
    const [mobileTshirt, setMobileTshirt] = useState("t-shirt");
  
    const handleToggleChange = (setter) => {
      setter((prev) => !prev);
    };
  
    return (
      <div className="p-10 mt-10">
        <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold">Home View</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Web Home Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Web Home</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Flash Products</span>
                <input
                  type="checkbox"
                  checked={webFlash}
                  onChange={() => handleToggleChange(setWebFlash)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>Feature Products</span>
                <input
                  type="checkbox"
                  checked={webFeature}
                  onChange={() => handleToggleChange(setWebFeature)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>New Arrival Products</span>
                <input
                  type="checkbox"
                  checked={webArrival}
                  onChange={() => handleToggleChange(setWebArrival)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>Best deal Products</span>
                <input
                  type="checkbox"
                  checked={webBestDeal}
                  onChange={() => handleToggleChange(setWebBestDeal)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div>
                <select
                  value={webJeans}
                  onChange={(e) => setWebJeans(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="jeans">Jeans</option>
                  <option value="shirt">Shirt</option>
                </select>
              </div>
              <div>
                <select
                  value={webTshirt}
                  onChange={(e) => setWebTshirt(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="t-shirt">T-shirt</option>
                  <option value="jacket">Jacket</option>
                </select>
              </div>
            </div>
          </div>
  
          {/* Mobile Home Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Mobile Home</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Flash Products</span>
                <input
                  type="checkbox"
                  checked={mobileFlash}
                  onChange={() => handleToggleChange(setMobileFlash)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>Feature Products</span>
                <input
                  type="checkbox"
                  checked={mobileFeature}
                  onChange={() => handleToggleChange(setMobileFeature)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>New Arrival Products</span>
                <input
                  type="checkbox"
                  checked={mobileArrival}
                  onChange={() => handleToggleChange(setMobileArrival)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div className="flex items-center justify-between">
                <span>Best deal Products</span>
                <input
                  type="checkbox"
                  checked={mobileBestDeal}
                  onChange={() => handleToggleChange(setMobileBestDeal)}
                  className="toggle toggle-primary"
                />
              </div>
  
              <div>
                <select
                  value={mobileJeans}
                  onChange={(e) => setMobileJeans(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="jeans">Jeans</option>
                  <option value="shirt">Shirt</option>
                </select>
              </div>
              <div>
                <select
                  value={mobileTshirt}
                  onChange={(e) => setMobileTshirt(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="t-shirt">T-shirt</option>
                  <option value="jacket">Jacket</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md">
          Update
        </button>
      </div>
    );
  }
  
export default HomeView;