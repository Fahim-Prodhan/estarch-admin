import { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../../helpers/baseUrl';

function ExtraSection() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [extraSectionInfo, setExtraSectionInfo] = useState(null);

    // State for each section
    const [categoryType1, setCategoryType1] = useState('');
    const [categoryName1, setCategoryName1] = useState('');
    const [categoryType2, setCategoryType2] = useState('');
    const [categoryName2, setCategoryName2] = useState('');
    const [categoryType3, setCategoryType3] = useState('');
    const [categoryName3, setCategoryName3] = useState('');

    useEffect(() => {
        const fetchExtraSectionInfo = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/extra-section`);
                setExtraSectionInfo(response.data);
                setCategoryType1(response.data.type1);
                setCategoryName1(response.data.name1);
                setCategoryType2(response.data.type2);
                setCategoryName2(response.data.name2);
                setCategoryType3(response.data.type3);
                setCategoryName3(response.data.name3);
            } catch (error) {
                console.error("Error fetching extra section info:", error);
            }
        };
        fetchExtraSectionInfo();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/categories/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/categories/subcategories`);
                setSubcategories(response.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubcategories();
    }, []);

    const handleCategoryTypeChange = async (event, section) => {
        const selectedType = event.target.value;
        if (section === 1) setCategoryType1(selectedType);
        if (section === 2) setCategoryType2(selectedType);
        if (section === 3) setCategoryType3(selectedType);

        try {
            await axios.put(`${baseUrl}/api/extra-section/${extraSectionInfo._id}`, {
                [`type${section}`]: selectedType,
            });
        } catch (error) {
            console.error("Error updating category type:", error);
        }

        if (selectedType === "Category") {
            if (section === 1) setCategoryName1('');
            if (section === 2) setCategoryName2('');
            if (section === 3) setCategoryName3('');
        } else if (selectedType === "Subcategory") {
            if (section === 1) setCategoryName1('');
            if (section === 2) setCategoryName2('');
            if (section === 3) setCategoryName3('');
        }
    };

    const handleCategoryNameChange = async (event, section) => {
        const selectedName = event.target.value;
        if (section === 1) setCategoryName1(selectedName);
        if (section === 2) setCategoryName2(selectedName);
        if (section === 3) setCategoryName3(selectedName);

        try {
            await axios.put(`${baseUrl}/api/extra-section/${extraSectionInfo._id}`, {
                [`name${section}`]: selectedName,
            });
        } catch (error) {
            console.error("Error updating category name:", error);
        }
    };

    const handleCheckboxChange = async (event, field) => {
        const { checked } = event.target;
        try {
            await axios.put(`${baseUrl}/api/extra-section/${extraSectionInfo._id}`, {
                [field]: checked,
            });
            setExtraSectionInfo(prevState => ({
                ...prevState,
                [field]: checked,
            }));
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    if (!extraSectionInfo) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Extra Section 1 */}
            <div className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Extra Section 1</h3>
                <div className="space-y-4">
                    {/* Category Type */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryType1" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.type1 || "Select Category Type"}
                        </label>
                        <select
                            name="categoryType1"
                            id="categoryType1"
                            onChange={(e) => handleCategoryTypeChange(e, 1)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryType1}
                        >
                            <option value="">Select Type</option>
                            <option value="Category">Category</option>
                            <option value="Subcategory">Subcategory</option>
                        </select>
                    </div>

                    {/* Category Name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryName1" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.name1 || `Select ${categoryType1 === "Category" ? "Category" : "Subcategory"} Name`}
                        </label>
                        <select
                            name="categoryName1"
                            id="categoryName1"
                            onChange={(e) => handleCategoryNameChange(e, 1)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryName1}
                        >
                            <option value="">Select {categoryType1 === "Category" ? "Category" : "Subcategory"} Name</option>
                            {(categoryType1 === "Category" ? categories : subcategories).map(item => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Web & Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="sectionWeb1" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionWeb1"
                                checked={extraSectionInfo.sectionWeb1}
                                onChange={(e) => handleCheckboxChange(e, 'sectionWeb1')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Web View
                        </label>
                        <label htmlFor="sectionMobile1" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionMobile1"
                                checked={extraSectionInfo.sectionMobile1}
                                onChange={(e) => handleCheckboxChange(e, 'sectionMobile1')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Mobile View
                        </label>
                    </div>
                </div>
            </div>

            {/* Extra Section 2 */}
            <div className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Extra Section 2</h3>
                <div className="space-y-4">
                    {/* Category Type */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryType2" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.type2 || "Select Category Type"}
                        </label>
                        <select
                            name="categoryType2"
                            id="categoryType2"
                            onChange={(e) => handleCategoryTypeChange(e, 2)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryType2}
                        >
                            <option value="">Select Type</option>
                            <option value="Category">Category</option>
                            <option value="Subcategory">Subcategory</option>
                        </select>
                    </div>

                    {/* Category Name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryName2" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.name2 || `Select ${categoryType2 === "Category" ? "Category" : "Subcategory"} Name`}
                        </label>
                        <select
                            name="categoryName2"
                            id="categoryName2"
                            onChange={(e) => handleCategoryNameChange(e, 2)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryName2}
                        >
                            <option value="">Select {categoryType2 === "Category" ? "Category" : "Subcategory"} Name</option>
                            {(categoryType2 === "Category" ? categories : subcategories).map(item => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Web & Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="sectionWeb2" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionWeb2"
                                checked={extraSectionInfo.sectionWeb2}
                                onChange={(e) => handleCheckboxChange(e, 'sectionWeb2')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Web View
                        </label>
                        <label htmlFor="sectionMobile2" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionMobile2"
                                checked={extraSectionInfo.sectionMobile2}
                                onChange={(e) => handleCheckboxChange(e, 'sectionMobile2')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Mobile View
                        </label>
                    </div>
                </div>
            </div>

            {/* Extra Section 3 */}
            <div className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Extra Section 3</h3>
                <div className="space-y-4">
                    {/* Category Type */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryType3" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.type3 || "Select Category Type"}
                        </label>
                        <select
                            name="categoryType3"
                            id="categoryType3"
                            onChange={(e) => handleCategoryTypeChange(e, 3)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryType3}
                        >
                            <option value="">Select Type</option>
                            <option value="Category">Category</option>
                            <option value="Subcategory">Subcategory</option>
                        </select>
                    </div>

                    {/* Category Name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="categoryName3" className="text-gray-700 font-medium italic">
                            Current: {extraSectionInfo?.name3 || `Select ${categoryType3 === "Category" ? "Category" : "Subcategory"} Name`}
                        </label>
                        <select
                            name="categoryName3"
                            id="categoryName3"
                            onChange={(e) => handleCategoryNameChange(e, 3)}
                            className="border border-gray-300 rounded-md p-2"
                            value={categoryName3}
                        >
                            <option value="">Select {categoryType3 === "Category" ? "Category" : "Subcategory"} Name</option>
                            {(categoryType3 === "Category" ? categories : subcategories).map(item => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Web & Mobile Toggle */}
                    <div className="flex items-center space-x-4">
                        <label htmlFor="sectionWeb3" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionWeb3"
                                checked={extraSectionInfo.sectionWeb3}
                                onChange={(e) => handleCheckboxChange(e, 'sectionWeb3')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Web View
                        </label>
                        <label htmlFor="sectionMobile3" className="flex items-center">
                            <input
                                type="checkbox"
                                id="sectionMobile3"
                                checked={extraSectionInfo.sectionMobile3}
                                onChange={(e) => handleCheckboxChange(e, 'sectionMobile3')}
                                className="mr-2 toggle toggle-primary"
                            />
                            Mobile View
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExtraSection;
