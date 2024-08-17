import React, { useState, useEffect } from 'react';

const HomeView = () => {
   // State variables for each toggle option
   const [webSellingCategory, setWebSellingCategory] = useState(false);
   const [webFeature, setWebFeature] = useState(false); // Correct the name to match schema
   const [webVideo, setWebVideo] = useState(false);
   const [webProductShowCase, setWebProductShowCase] = useState(false); // Correct the name
   const [webArrival, setWebArrival] = useState(false); // Correct the name
   const [webBestDeal, setWebBestDeal] = useState(false); // Correct the name
   const [webNewsLetter, setWebNewsLetter] = useState(false); // Correct the name
 
   const [mobileSellingCategory, setMobileSellingCategory] = useState(false);
   const [mobileFeature, setMobileFeature] = useState(false); // Correct the name
   const [mobileVideo, setMobileVideo] = useState(false);
   const [mobileProductShowCase, setMobileProductShowCase] = useState(false); // Correct the name
   const [mobileArrival, setMobileArrival] = useState(false); // Correct the name
   const [mobileBestDeal, setMobileBestDeal] = useState(false); // Correct the name
   const [mobileNewsLetter, setMobileNewsLetter] = useState(false); // Correct the name
 
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
     // Fetch the initial states from the backend when the component mounts
     const fetchToggleStates = async () => {
       try {
         const response = await fetch('http://localhost:5000/api/toggle/toggleStates');
         if (!response.ok) throw new Error('Network response was not ok');
         const data = await response.json();
         
         // Update all toggle states
         setWebSellingCategory(data.webSellingCategory);
         setWebFeature(data.webFeature); // Corrected the field name
         setWebVideo(data.webVideo);
         setWebProductShowCase(data.webProductShowCase); // Corrected the field name
         setWebArrival(data.webArrival); // Corrected the field name
         setWebBestDeal(data.webBestDeal); // Corrected the field name
         setWebNewsLetter(data.webNewsLetter); // Corrected the field name
 
         setMobileSellingCategory(data.mobileSellingCategory);
         setMobileFeature(data.mobileFeature); // Corrected the field name
         setMobileVideo(data.mobileVideo);
         setMobileProductShowCase(data.mobileProductShowCase); // Corrected the field name
         setMobileArrival(data.mobileArrival); // Corrected the field name
         setMobileBestDeal(data.mobileBestDeal); // Corrected the field name
         setMobileNewsLetter(data.mobileNewsLetter); // Corrected the field name
       } catch (error) {
         console.error('Error fetching toggle states:', error);
       }
     };
 
     fetchToggleStates();
   }, []);
 
   const handleToggleChange = async (toggleName, value) => {
     setLoading(true);
     try {
       const response = await fetch('http://localhost:5000/api/toggle/toggleStates', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ [toggleName]: value }),
       });
 
       if (!response.ok) throw new Error('Network response was not ok');
 
       // Fetch updated states after the change
       const updatedResponse = await fetch('http://localhost:5000/api/toggle/toggleStates');
       const updatedData = await updatedResponse.json();
 
       // Update all toggle states
       setWebSellingCategory(updatedData.webSellingCategory);
       setWebFeature(updatedData.webFeature); // Corrected the field name
       setWebVideo(updatedData.webVideo);
       setWebProductShowCase(updatedData.webProductShowCase); // Corrected the field name
       setWebArrival(updatedData.webArrival); // Corrected the field name
       setWebBestDeal(updatedData.webBestDeal); // Corrected the field name
       setWebNewsLetter(updatedData.webNewsLetter); // Corrected the field name
       
       setMobileSellingCategory(updatedData.mobileSellingCategory);
       setMobileFeature(updatedData.mobileFeature); // Corrected the field name
       setMobileVideo(updatedData.mobileVideo);
       setMobileProductShowCase(updatedData.mobileProductShowCase); // Corrected the field name
       setMobileArrival(updatedData.mobileArrival); // Corrected the field name
       setMobileBestDeal(updatedData.mobileBestDeal); // Corrected the field name
       setMobileNewsLetter(updatedData.mobileNewsLetter); // Corrected the field name
     } catch (error) {
       console.error('Error updating toggle states:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleSave = async () => {
     setLoading(true);
     try {
       const response = await fetch('http://localhost:5000/api/toggle/toggleStates', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           webSellingCategory,
           webFeature, // Corrected the field name
           webVideo,
           webProductShowCase, // Corrected the field name
           webArrival, // Corrected the field name
           webBestDeal, // Corrected the field name
           webNewsLetter, // Corrected the field name
           mobileSellingCategory,
           mobileFeature, // Corrected the field name
           mobileVideo,
           mobileProductShowCase, // Corrected the field name
           mobileArrival, // Corrected the field name
           mobileBestDeal, // Corrected the field name
           mobileNewsLetter // Corrected the field name
         }),
       });
 
       if (!response.ok) throw new Error('Network response was not ok');
       
       // Optionally fetch updated states after saving
       const updatedResponse = await fetch('http://localhost:5000/api/toggle/toggleStates');
       const updatedData = await updatedResponse.json();
 
       // Update all toggle states
       setWebSellingCategory(updatedData.webSellingCategory);
       setWebFeature(updatedData.webFeature); // Corrected the field name
       setWebVideo(updatedData.webVideo);
       setWebProductShowCase(updatedData.webProductShowCase); // Corrected the field name
       setWebArrival(updatedData.webArrival); // Corrected the field name
       setWebBestDeal(updatedData.webBestDeal); // Corrected the field name
       setWebNewsLetter(updatedData.webNewsLetter); // Corrected the field name
       
       setMobileSellingCategory(updatedData.mobileSellingCategory);
       setMobileFeature(updatedData.mobileFeature); // Corrected the field name
       setMobileVideo(updatedData.mobileVideo);
       setMobileProductShowCase(updatedData.mobileProductShowCase); // Corrected the field name
       setMobileArrival(updatedData.mobileArrival); // Corrected the field name
       setMobileBestDeal(updatedData.mobileBestDeal); // Corrected the field name
       setMobileNewsLetter(updatedData.mobileNewsLetter); // Corrected the field name
     } catch (error) {
       console.error('Error saving toggle states:', error);
     } finally {
       setLoading(false);
     }
   };
 

  return (
    <div className="p-10 mt-10">
  {/* Header */}
  <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
    <h2 className="text-lg font-semibold">Home View</h2>
  </div>

  {/* Main Grid Container */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Web Home Section */}
    <div>
      <h3 className="text-lg font-medium mb-4">Web Home</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Selling Category</span>
          <input
            type="checkbox"
            checked={webSellingCategory}
            onChange={(e) => handleToggleChange('webSellingCategory', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Feature Products</span>
          <input
            type="checkbox"
            checked={webFeature}
            onChange={(e) => handleToggleChange('webFeature', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Video</span>
          <input
            type="checkbox"
            checked={webVideo}
            onChange={(e) => handleToggleChange('webVideo', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Product Showcase</span>
          <input
            type="checkbox"
            checked={webProductShowCase}
            onChange={(e) => handleToggleChange('webProductShowCase', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>New Arrival</span>
          <input
            type="checkbox"
            checked={webArrival}
            onChange={(e) => handleToggleChange('webArrival', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Best Deals</span>
          <input
            type="checkbox"
            checked={webBestDeal}
            onChange={(e) => handleToggleChange('webBestDeal', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Newsletter</span>
          <input
            type="checkbox"
            checked={webNewsLetter}
            onChange={(e) => handleToggleChange('webNewsLetter', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
      </div>
    </div>

    {/* Mobile Home Section */}
    <div>
      <h3 className="text-lg font-medium mb-4">Mobile Home</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Selling Category</span>
          <input
            type="checkbox"
            checked={mobileSellingCategory}
            onChange={(e) => handleToggleChange('mobileSellingCategory', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Feature Products</span>
          <input
            type="checkbox"
            checked={mobileFeature}
            onChange={(e) => handleToggleChange('mobileFeature', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Video</span>
          <input
            type="checkbox"
            checked={mobileVideo}
            onChange={(e) => handleToggleChange('mobileVideo', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Product Showcase</span>
          <input
            type="checkbox"
            checked={mobileProductShowCase}
            onChange={(e) => handleToggleChange('mobileProductShowCase', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>New Arrival</span>
          <input
            type="checkbox"
            checked={mobileArrival}
            onChange={(e) => handleToggleChange('mobileArrival', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Best Deals</span>
          <input
            type="checkbox"
            checked={mobileBestDeal}
            onChange={(e) => handleToggleChange('mobileBestDeal', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Newsletter</span>
          <input
            type="checkbox"
            checked={mobileNewsLetter}
            onChange={(e) => handleToggleChange('mobileNewsLetter', e.target.checked)}
            className="toggle toggle-primary"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Save Button */}
  <div className="mt-6">
    <button
      onClick={handleSave}
      className={`btn btn-primary ${loading ? 'loading' : ''}`}
    >
      Save
    </button>
  </div>
</div>

  );
};

export default HomeView;
