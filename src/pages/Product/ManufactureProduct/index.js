import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from '../../../helpers/baseUrl';
import axios from 'axios';

const AddPurchase = () => {
    document.title = "Estarch | Manufacture Product";

    const [productValue, setProductValue] = useState('');
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [skuproduct, setSkuProduct] = useState([]);
    const [productAssets, setProductAssets] = useState([]);
    const [assetValue, setAssetValue] = useState('');
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const [showAssetSuggestions, setShowAssetSuggestions] = useState(false);
    const [totalCost, setTotalCost] = useState(0);
    const [totalProduct, setTotalProduct] = useState('');
    const [otherCost, setOtherCost] = useState(0); // State for Other Cost



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/products/status-on-products`);
                const data = await response.json();
                setSkuProduct(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            const fetchProductAssets = async () => {
                try {
                    const response = await fetch(`${baseUrl}/api/product-asset?productId=${selectedProduct._id}`);
                    const data = await response.json();
                    setProductAssets(data);
                    setFilteredAssets(data);
                } catch (error) {
                    console.error('Error fetching product assets:', error);
                }
            };
            fetchProductAssets();
        }
    }, [selectedProduct]);

    useEffect(() => {
        const filtered = skuproduct.filter(product =>
            product.productName.toLowerCase().includes(productValue.toLowerCase()) ||
            product.SKU.toLowerCase().includes(productValue.toLowerCase())
        );
        setFilteredProduct(filtered);
    }, [productValue, skuproduct]);

    const clickProduct = (product) => {
        if (!product) return;

        const newProduct = {
            _id: product._id,
            productName: product.productName,
            SKU: product.SKU,
            image: product.images[0],
        };

        setSelectedProduct(newProduct);
        setProductValue('');
        setShowProductSuggestions(false);
    };

    useEffect(() => {
        const filtered = productAssets.filter(asset =>
            asset.assetName.toLowerCase().includes(assetValue.toLowerCase())
        );
        setFilteredAssets(filtered);
    }, [assetValue, productAssets]);

    const clickAsset = (asset) => {
        if (!asset) return;

        if (selectedAssets.find(selected => selected._id === asset._id)) {
            alert("Asset already selected", asset.assetName);
            setShowAssetSuggestions(false);
            return;
        }

        const newAsset = {
            _id: asset._id,
            assetName: asset.assetName,
            quantity: asset.quantity,
            perItemPrice: asset.perItemPrice,
            usedQuantity: 0,
        };

        console.log("Adding asset:", newAsset);
        setSelectedAssets(prevAssets => [...prevAssets, newAsset]);
        setAssetValue('');
        setShowAssetSuggestions(false);
    };

    const handleQuantityChange = (index, value) => {
        const updatedAssets = [...selectedAssets];
        updatedAssets[index].usedQuantity = value;
        setSelectedAssets(updatedAssets);
        calculateTotalCost(updatedAssets);
    };

    const handleRemoveAsset = (index) => {
        const updatedAssets = selectedAssets.filter((_, i) => i !== index);
        setSelectedAssets(updatedAssets);
        calculateTotalCost(updatedAssets);
    };


    const calculateTotalCost = (assets) => {
        const assetTotal = assets.reduce((sum, asset) => {
            return sum + (asset.perItemPrice * asset.usedQuantity);
        }, 0);
        // console.log("inside",otherCost);  
        setTotalCost(assetTotal + parseInt(otherCost)); // Include Other Cost
    };

    useEffect(() => {
        calculateTotalCost(selectedAssets);
    }, [otherCost])

    const handleProductInputClick = () => {
        setShowProductSuggestions(true);
    };

    const handleAssetInputClick = () => {
        setShowAssetSuggestions(true);
    };

    const closeProductSuggestions = () => {
        setShowProductSuggestions(false);
    };

    const closeAssetSuggestions = () => {
        setShowAssetSuggestions(false);
    };

    const handleManufacture = async () => {
        if (!selectedProduct || selectedAssets.length === 0 || totalProduct <= 0) {
            alert("Please ensure you have selected a product, added assets, and specified total product.");
            return;
        }

        const costPerProduct = Math.ceil(parseFloat(calculateCostPerProduct()))

        const manufactureData = {
            productId: selectedProduct._id,
            assets: selectedAssets.map(asset => ({
                assetId: asset._id,
                usedQuantity: parseInt(asset.usedQuantity)
            })),
            totalProduct,
            otherCost,
            costPerProduct
        }

      console.log(manufactureData);

        try {
            const res = await axios.post(`${baseUrl}/api/manufacture-product/create`, manufactureData);
            alert("Product Manufactured Successfully");
        } catch (error) {
            console.error('Error manufacturing product:', error);
            alert("Failed to manufacture product. Please try again.");
        }
    };

    const calculateCostPerProduct = () => {
        const productCount = parseInt(totalProduct) || 0;
        return productCount > 0 ? (totalCost / productCount).toFixed(2) : 0;
    };

    const handleTotalProductChange = (e) => {
        setTotalProduct(parseInt(e.target.value));
    };

    return (
        <React.Fragment>
            <div className="page-content ">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Manufacture Product" />
                    <div className='w-full mb-16 '>
                        <input
                            value={productValue}
                            onChange={(e) => setProductValue(e.target.value)}
                            onClick={handleProductInputClick}
                            type="text"
                            placeholder="Type SKU/Name"
                            className="w-full p-2 border-2 rounded max-w-lg "
                        />
                        {showProductSuggestions && (
                            <div className="relative max-w-lg mt-2 z-[100] h-32 overflow-y-scroll bg-white border border-gray-300 rounded shadow-md">
                                <button
                                    onClick={closeProductSuggestions}
                                    className="absolute top-1 right-1 text-gray-500 text-2xl"
                                >
                                    &times;
                                </button>
                                {filteredProduct.length > 0 ? (
                                    filteredProduct.map((product, index) => (
                                        <div
                                            key={index}
                                            onClick={() => clickProduct(product)}
                                            className="cursor-pointer p-2 hover:bg-gray-200 text-black mr-12"
                                        >
                                            {product.productName} <span>({product.SKU})</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-gray-500">No product available</div>
                                )}
                            </div>
                        )}

                        {selectedProduct && (
                            <div className="mt-4 ">
                                <h3 className="text-lg font-semibold text-orange-500">Selected Product</h3>
                                <table className="table-auto w-full mt-2 border border-gray-300 rounded shadow-md bg-white">
                                    <thead>
                                        <tr className=" text-gray-700 bg-white">
                                            <th className="px-4 py-2 border-b border-gray-300">Image</th>
                                            <th className="px-4 py-2 border-b border-gray-300">Product Name</th>
                                            <th className="px-4 py-2 border-b border-gray-300">SKU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border px-4 py-4">
                                                <img src={`${baseUrl}/${selectedProduct.image}`} alt={selectedProduct.productName} className="w-12" />
                                            </td>
                                            <td className="border px-4 py-2">{selectedProduct.productName}</td>
                                            <td className="border px-4 py-2">{selectedProduct.SKU}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedProduct && <hr className='my-6 border-2 text-orange-700' />}

                        {selectedProduct && (
                            <div className="mt-6">
                                <input
                                    value={assetValue}
                                    onChange={(e) => setAssetValue(e.target.value)}
                                    onClick={handleAssetInputClick}
                                    type="text"
                                    placeholder="Search Asset Products"
                                    className="w-full max-w-xs p-2 border-2 rounded"
                                />

                                {showAssetSuggestions && (
                                    <div className="relative max-w-xs mt-2 z-[100] h-32 overflow-y-scroll bg-white border border-gray-300 rounded shadow-md">
                                        <button
                                            onClick={closeAssetSuggestions}
                                            className="absolute top-1 right-1 text-gray-500 text-2xl "
                                        >
                                            &times;
                                        </button>
                                        {filteredAssets.length > 0 ? (
                                            filteredAssets.map((asset, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => clickAsset(asset)}
                                                    className="cursor-pointer p-2 mr-12 hover:bg-gray-200 text-black"
                                                >
                                                    {asset.assetName} <span>({asset.quantity})</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">No asset available</div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 ">
                                    <h3 className="text-lg font-semibold text-orange-500">Selected Assets</h3>
                                    <table className="table-auto w-full mt-2 border border-gray-300 rounded shadow-md bg-white">
                                        <thead>
                                            <tr className=" text-gray-700 bg-white">
                                                <th className="px-4 py-2 border-b border-gray-300">Asset Name</th>
                                                <th className="px-4 py-2 border-b border-gray-300">Available Quantity</th>
                                                <th className="px-4 py-2 border-b border-gray-300">Cost/Item</th>
                                                <th className="px-4 py-2 border-b border-gray-300">Use Quantity</th>
                                                <th className="px-4 py-2 border-b border-gray-300">Total Cost</th>
                                                <th className="px-4 py-2 border-b border-gray-300">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedAssets.map((asset, index) => (
                                                <tr className="hover:bg-gray-50" key={index}>
                                                    <td className="border px-4 py-2">{asset.assetName}</td>
                                                    <td className="border px-4 py-2">{asset.quantity}</td>
                                                    <td className="border px-4 py-2">{asset.perItemPrice}</td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={asset.usedQuantity}
                                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                            className="border-2 border-red-400 rounded px-2 py-1"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">{(asset.perItemPrice * asset.usedQuantity).toFixed(2)}</td>
                                                    <td className="border px-4 py-2">
                                                        <button
                                                            onClick={() => handleRemoveAsset(index)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {selectedAssets.length > 0 && (
                                    <div className="mt-4   grid grid-cols-12 items-end">
                                        <div className='col-span-5 bg-white p-10 shadow-md' >
                                            <label htmlFor="otherCost" className="block text-gray-700 font-semibold">Other Cost:</label>
                                            <input
                                                id="otherCost"
                                                type="number"
                                                value={otherCost}
                                                onChange={(e) => setOtherCost(parseInt(e.target.value))}
                                                placeholder="Enter Other Cost"
                                                className="w-full max-w-xs p-2 border-2 rounded mb-2"
                                            />
                                            <label htmlFor="otherCost" className="block text-gray-700 font-semibold">Total Product:</label>

                                            <input
                                                type="number"
                                                value={totalProduct}
                                                onChange={handleTotalProductChange}
                                                className="w-full max-w-xs p-2 border-2 rounded mb-4"
                                                placeholder="Enter total number of products "
                                                required
                                            />
                                            <h3 className="text-lg font-semibold text-orange-500">Total Cost: {totalCost.toFixed(2)} Taka</h3>

                                            <h3 className="text-lg font-semibold text-orange-500">Cost Per Product: {calculateCostPerProduct()} Taka</h3>
                                        </div>
                                        <div className='col-span-6 place-self-end mr-12' >
                                            <button
                                                onClick={handleManufacture}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Manufacture
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default AddPurchase;
