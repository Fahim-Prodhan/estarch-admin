import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import JoditEditor from 'jodit-react';
import { fetchTypes } from "../../../utils/typeApi.js";
import baseUrl from '../../../helpers/baseUrl';

function AddProduct() {
  document.title = " Estarch | Add Product"
  const [showSize, setShowSize] = useState(false);
  const [freeDelevary, setFreeDelevary] = useState(false);
  const [featureProduct, setFeatureProduct] = useState(false);
  const [productStatus, setProductStatus] = useState(false);
  const [posSuggestion, setPosSuggestion] = useState(false);
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [guideContent, setGuideContent] = useState('');
  const [discount, setDiscount] = useState({ type: 'Flat', amount: '' });
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [sizeDetails, setSizeDetails] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const getTypes = async () => {
      const data = await fetchTypes();
      setTypes(data);
    };
    getTypes();
  }, []);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/categories/brands`);
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedType) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/categories/categories/${selectedType}`);
          const data = await response.json();
          console.log(data);
          
          setCategories(data)
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };

      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/categories/subcategories/${selectedCategory}`);
          const data = await response.json();
          // console.log(data);
          setSubCategories(data);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };

      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);
  const handleRegularPriceChange = (e) => {
    const price = e.target.value;
    setRegularPrice(price);
    updateAllSizeDetails('purchasePrice', price);
  };


  const generateId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };
  const addSize = (size) => {
    if (!selectedSizes.includes(size)) {
      const newSizeDetails = {
        size,
        barcode: generateId(),
        purchasePrice: '00',
        sellingPrice: salePrice,
        discountPercent: discount.type === 'Percentage' ? discount.amount : '00',
        discountAmount: discount.type === 'Flat' ? discount.amount : '00',
        afterDiscount: calculateAfterDiscount(salePrice, discount),
        wholesalePrice: '00',
        openingStock: '00',
        ospPrice: '00'
      };
      setSelectedSizes([...selectedSizes, size]);
      setSizeDetails([...sizeDetails, newSizeDetails]);
    }
    setInputValue("");
  };

  const calculateAfterDiscount = (price, discount) => {
    if (discount.type === 'Flat') {
      return (price - discount.amount).toFixed(2);
    } else if (discount.type === 'Percentage') {
      return (price - (price * discount.amount / 100)).toFixed(2);
    }
    return price;
  };

  const updateSizeDetail = (index, field, value) => {
    const newDetails = [...sizeDetails];
    newDetails[index][field] = value;

    // Automatically update dependent fields
    if (field === 'sellingPrice' || field === 'discountPercent' || field === 'discountAmount') {
      newDetails[index].afterDiscount = calculateAfterDiscount(
        newDetails[index].sellingPrice,
        discount.type === 'Flat'
          ? { type: 'Flat', amount: newDetails[index].discountAmount }
          : { type: 'Percentage', amount: newDetails[index].discountPercent }
      );
    }

    setSizeDetails(newDetails);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setDiscount({
      ...discount,
      type
    });
    setSizeDetails(sizeDetails.map(detail => ({
      ...detail,
      discountPercent: type === 'Percentage' ? discount.amount : detail.discountPercent,
      discountAmount: type === 'Flat' ? discount.amount : detail.discountAmount,
      afterDiscount: calculateAfterDiscount(detail.sellingPrice, { type, amount: discount.amount })
    })));
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setDiscount({
      ...discount,
      amount
    });
    setSizeDetails(sizeDetails.map(detail => ({
      ...detail,
      discountPercent: discount.type === 'Percentage' ? amount : detail.discountPercent,
      discountAmount: discount.type === 'Flat' ? amount : detail.discountAmount,
      afterDiscount: calculateAfterDiscount(detail.sellingPrice, { type: discount.type, amount })
    })));
  };

  const handleSalePriceChange = (e) => {
    const price = e.target.value;
    setSalePrice(price);
    setSizeDetails(sizeDetails.map(detail => ({
      ...detail,
      sellingPrice: price,
      afterDiscount: calculateAfterDiscount(price, discount)
    })));
  };

  const removeSize = (size) => {
    setSelectedSizes(selectedSizes.filter((s) => s !== size));
    setSizeDetails(sizeDetails.filter((detail) => detail.size !== size));
  };


  const updateAllSizeDetails = (field, value) => {
    const newDetails = sizeDetails.map((detail) => ({
      ...detail,
      [field]: value,
      afterDiscount: detail.sellingPrice - (field === 'discountAmount' ? value : 0)
    }));
    setSizeDetails(newDetails);
  };

  const filteredSizes = sizes.filter(
    (size) =>
      size.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSizes.includes(size)
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    console.log(file);
    const uploadedImages = [];
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.file);
        uploadedImages.push(result.file);
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }


    setImages(prevImages => [...prevImages, ...uploadedImages]);
    setLoading(false);
  };
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    height: 400
  }), []);
  const handleSave = async () => {
    try {
      const productData = {
        productName,
        showSize,
        freeDelevary,
        featureProduct,
        productStatus,
        posSuggestion,
        images,
        videoUrl,
        content,
        guideContent,
        discount,
        regularPrice,
        salePrice,
        selectedSizes,
        sizeDetails,
        selectedSubCategory,
        selectedCategoryName,
        selectedCategory,
        selectedBrand,
        selectedType

      };

//  console.log(productData);

      const response = await fetch(`${baseUrl}/api/products/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Product saved successfully:', result);
      } else {
        console.error('Error saving product:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleChangeCategory = (e) => {
    const selected = categories.find(cat => cat._id === e.target.value);
    setSelectedCategory(selected._id);
    setSelectedCategoryName(selected.name);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Minible" breadcrumbItem="Add Product" />
          <div>
            <div className="p-6 bg-base-100 rounded-lg shadow-lg w-full">
              <div className="bg-neutral-focus p-4 rounded-lg ">
                <div className="border shadow-xl">
                  <div className="bg-sky-950 text-white text-2xl py-5 px-4">
                    <h2 className="text-2xl font-semibold text-white">Others</h2>
                  </div>
                  <div className="p-4 flex justify-evenly ">
                    <div className="flex items-center justify-center">
                      <input onChange={() => setFreeDelevary(!freeDelevary)} type="checkbox" className="toggle toggle-primary" />
                      <label className="ml-3 text-sm font-medium text-gray-700">Free Delivery </label>
                    </div>
                    <div className="flex items-center">
                      <input onChange={() => setFeatureProduct(!featureProduct)} type="checkbox" className="toggle toggle-primary" />
                      <label className="ml-3 text-sm font-medium text-gray-700">Feature Product </label>
                    </div>
                    <div className="flex items-center">
                      <input onChange={() => setProductStatus(!productStatus)} type="checkbox" className="toggle toggle-primary" />
                      <label className="ml-3 text-sm font-medium text-gray-700">Product Status </label>
                    </div>
                    <div className="flex items-center">
                      <input onChange={() => setPosSuggestion(!posSuggestion)} type="checkbox" className="toggle toggle-primary" />
                      <label className="ml-3 text-sm font-medium text-gray-700">Pos Suggestion </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-focus p-4 rounded-lg ">
                <form className="space-y-4 border shadow-xl ">
                  <h1 className='bg-sky-950 text-white font-semibold text-2xl py-5 '><span className='mx-5'>Product Information</span></h1>
                  <div className='flex justify-center items-center'>
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="productName">Product Name<span className="text-red-500">*</span></label>
                    <input onChange={(e)=>setProductName(e.target.value)} type="text" name='productName' id="productName" className="input input-bordered w-[600px]" required />
                  </div>
                  <div className='flex justify-center items-center'>
                    <label className=" w-80 text-sm font-medium text-gray-700" htmlFor="category">Type</label>
                    <select onChange={(e) => setSelectedType(e.target.value)} id="Type" className="select select-bordered w-[600px]">
                      <option>Select a Type</option>
                      {types?.map((type) => (
                        <option key={type._id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex justify-center items-center'>
                    <label className=" w-80 text-sm font-medium text-gray-700" htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={handleChangeCategory}
                      className="select select-bordered w-[600px]"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex justify-center items-center'>
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="sticker">Sub Category</label>
                    <select onChange={(e) => setSelectedSubCategory(e.target.value)} id="Sub Category" className="select select-bordered w-[600px]">
                      <option>Select a Sub Category</option>
                      {subCategories?.map((subCat) => (
                        <option key={subCat._id} value={subCat.name}>{subCat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='flex justify-center items-center'>
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="brand">Brand</label>
                    <select onChange={(e) => setSelectedBrand(e.target.value)} id="brand" className="select select-bordered w-[600px]">
                      <option>Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className='flex justify-center items-center'>
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="unit">Unit</label>
                    <input type="text" id="unit" placeholder="Unit (kg, pc, etc)" className="input input-bordered w-[600px]" />
                  </div>
                  <div className='flex items-center justify-center '>
                    <label className="w-80 text-sm font-medium text-gray-700">Product Type</label>
                    <div className="flex space-x-4 w-[600px]">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="productType" value="Stock" className="radio radio-primary" />
                        <span>Stock</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="productType" value="Pre-order" className="radio radio-primary" />
                        <span>Pre-order</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="productType" value="none" className="radio radio-primary" defaultChecked />
                        <span>None</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-neutral-focus p-4 rounded-lg">
                <form className="space-y-4 border shadow-xl">
                  <div className="flex justify-between items-center mb-4 bg-sky-950 text-white text-2xl py-5 px-4">
                    <h2 className="text-2xl font-semibold text-white">Media</h2>
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="productImage">Product Images</label>
                    <div className="w-[600px]">
                      <label htmlFor="productImage" className="flex justify-center items-center border border-dashed border-gray-300 p-10 cursor-pointer">
                        <span className="text-gray-400">+</span>
                      </label>
                      <input
                        type="file"
                        id="productImage"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      {loading && <p>Loading...</p>}
                      <div className="mt-4 flex flex-wrap">
                        {images.map((imageUrl, index) => (
                          <div key={index} className="relative m-2">
                            <img
                              src={imageUrl}
                              alt={`Uploaded ${index}`}
                              className="w-32 h-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 focus:outline-none"
                              onClick={() => handleRemoveImage(index)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="videoUrl">Video URL</label>
                    <input
                      type="text"
                      id="videoUrl"
                      value={videoUrl}
                      onChange={handleVideoUrlChange}
                      className="input input-bordered w-[600px]"
                      placeholder="Video URL"
                    />
                  </div>
                </form>
              </div>
              <div className="bg-neutral-focus p-4 rounded-lg">
                <form className="space-y-4 border shadow-xl">
                  <div className="flex justify-between items-center mb-4 bg-sky-950 text-2xl py-5 px-4">
                    <h2 className="text-2xl text-white font-semibold">No Variants</h2>
                    <input type="checkbox" className="toggle toggle-primary" onChange={() => setShowSize(!showSize)} />
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="stockAlert">SKU</label>
                    <input value='EST0001' disabled type="text" id="sku" className="input input-bordered w-[600px]" placeholder="SKU" />
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="stockAlert">Stock Alert</label>
                    <input type="text" id="stockAlert" className="input input-bordered w-[600px]" placeholder="stock alert number" />
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="regularPrice">Regular Price<span className="text-red-500">*</span></label>
                    <input type="text" id="regularPrice" className="input input-bordered w-[600px]" placeholder="regular Price" required value={regularPrice} onChange={handleRegularPriceChange} />
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="discountType">
                      Discount
                    </label>
                    <div className="flex space-x-4 w-[600px]">
                      <select
                        id="discountType"
                        className="select select-bordered w-full"
                        value={discount.type}
                        onChange={handleTypeChange}
                      >
                        <option value="Flat">Flat</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                      <input
                        type="text"
                        id="discountAmount"
                        className="input input-bordered w-full"
                        placeholder="Discount Amount"
                        value={discount.amount}
                        onChange={handleAmountChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center ">
                    <label className="w-80 text-sm font-medium text-gray-700" htmlFor="salePrice">Sale Price<span className="text-red-500">*</span></label>
                    <input type="text" id="salePrice" className="input input-bordered w-[600px]" placeholder="Sale Price" required value={salePrice} onChange={handleSalePriceChange} />
                  </div>
                </form>
                {
                  showSize && <div>
                    <div className="p-4">
                      <div className="flex flex-col mb-4">
                        <div className=' flex gap-5'>
                          <select id="category" className="select select-bordered w-1/2">
                            <option>Select a Type</option>
                            <option>Type 1</option>
                            <option>Type 2</option>
                            <option>Type 3</option>
                          </select>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type to search sizes..."
                            className="p-2 border border-gray-300 rounded w-1/2"
                          />
                        </div>
                        {inputValue && (
                          <div className="mt-2 bg-white border border-gray-300 rounded shadow-md">
                            {filteredSizes.length > 0 ? (
                              filteredSizes.map((size) => (
                                <div
                                  key={size}
                                  onClick={() => addSize(size)}
                                  className="cursor-pointer p-2 hover:bg-gray-200"
                                >
                                  {size}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">No sizes available</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedSizes.map((size) => (
                          <div
                            key={size}
                            className="flex items-center px-2 py-1 bg-gray-200 rounded-full"
                          >
                            <span>{size}</span>
                            <button
                              onClick={() => removeSize(size)}
                              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="container mx-auto p-4">
                      <h2 className="text-lg font-semibold mb-4">Price and Stock</h2>

                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="w-full bg-gray-100">
                            <th className="py-2 px-4 border-b border-gray-200">Size-Color</th>
                            <th className="py-2 px-4 border-b border-gray-200">Barcode</th>
                            <th className="py-2 px-4 border-b border-gray-200">Purchase Price</th>
                            <th className="py-2 px-4 border-b border-gray-200">Selling Price</th>
                            <th className="py-2 px-4 border-b border-gray-200">Discount(%)</th>
                            <th className="py-2 px-4 border-b border-gray-200">Discount Amount</th>
                            <th className="py-2 px-4 border-b border-gray-200">After Discount</th>
                            <th className="py-2 px-4 border-b border-gray-200">Wholesale Price</th>
                            <th className="py-2 px-4 border-b border-gray-200">Opening Stock</th>
                            <th className="py-2 px-4 border-b border-gray-200">O.S.P. Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeDetails.map((item, index) => (
                            <tr key={index} className="text-center">
                              <td className="py-2 px-4 border-b border-gray-200">{item.size}</td>
                              <td className="py-2 px-4 border-b border-gray-200">{item.barcode}</td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.purchasePrice}
                                  onChange={(e) => updateSizeDetail(index, 'purchasePrice', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.sellingPrice}
                                  onChange={(e) => updateSizeDetail(index, 'sellingPrice', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.discountPercent}
                                  onChange={(e) => updateSizeDetail(index, 'discountPercent', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.discountAmount}
                                  onChange={(e) => updateSizeDetail(index, 'discountAmount', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.afterDiscount}
                                  onChange={(e) => updateSizeDetail(index, 'afterDiscount', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.wholesalePrice}
                                  onChange={(e) => updateSizeDetail(index, 'wholesalePrice', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.openingStock}
                                  onChange={(e) => updateSizeDetail(index, 'openingStock', e.target.value)}
                                />
                              </td>
                              <td className="py-2 px-4 border-b border-gray-200">
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 px-2 py-1"
                                  value={item.ospPrice}
                                  onChange={(e) => updateSizeDetail(index, 'ospPrice', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
              <div className="bg-neutral-focus p-4 rounded-lg ">
                <div className="border shadow-xl">
                  <div className="bg-sky-950 text-white text-2xl py-5 px-4">
                    <h2 className="text-2xl font-semibold text-white">Description</h2>
                  </div>
                  <div>
                    <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '400px' }}>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1}
                        onBlur={newContent => setContent(newContent)}
                        onChange={newContent => setContent(newContent)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-focus p-4 rounded-lg ">
                <div className="border shadow-xl">
                  <div className="bg-sky-950 text-white text-2xl py-5 px-4">
                    <h2 className="text-2xl font-semibold text-white">Guide Line</h2>
                  </div>
                  <div>
                    <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '400px' }}>
                      <JoditEditor
                        ref={editor}
                        value={guideContent}
                        config={config}
                        tabIndex={1}
                        onBlur={newContent => setGuideContent(newContent)}
                        onChange={newContent => setGuideContent(newContent)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <button onClick={handleSave} className=" m-4 bg-sky-950 hover:bg-sky-950 btn w-96 text-white">SAVE</button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>

  )
}

export default AddProduct