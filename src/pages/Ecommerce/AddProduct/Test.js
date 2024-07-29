import React, { useState } from 'react';

function Test() {
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const [sizeDetails, setSizeDetails] = useState([]);

    const generateId = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    };

    const addSize = (size) => {
        if (!selectedSizes.includes(size)) {
            const newSizeDetails = {
                size,
                barcode: generateId(),
                purchasePrice: '00',
                sellingPrice: '00',
                discountPercent: '00',
                discountAmount: '00',
                afterDiscount: '00',
                wholesalePrice: '00',
                openingStock: '00',
                ospPrice: '00'
            };
            setSelectedSizes([...selectedSizes, size]);
            setSizeDetails([...sizeDetails, newSizeDetails]);
        }
        setInputValue("");
    };

    const removeSize = (size) => {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
        setSizeDetails(sizeDetails.filter((detail) => detail.size !== size));
    };

    const updateSizeDetail = (index, field, value) => {
        const newDetails = [...sizeDetails];
        newDetails[index][field] = value;
        setSizeDetails(newDetails);
    };

    const filteredSizes = sizes.filter(
        (size) =>
            size.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedSizes.includes(size)
    );

    return (
        <div>
            {/* Other parts of the component */}
            
            <div className="p-4">
                <div className="flex flex-col mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type to search sizes..."
                        className="p-2 border border-gray-300 rounded"
                    />
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
    );
}

export default Test;