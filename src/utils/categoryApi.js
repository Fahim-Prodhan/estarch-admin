import baseUrl from "../helpers/baseUrl";

const API_BASE_URL = `${baseUrl}/api/categories`;

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
};
// categoryApi.js
// utils/categoryApi.js

export const toggleCategoryStatus = async (id, isActive) => {
    try {
        const response = await fetch(`${baseUrl}/api/categories/categories/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ active: !isActive }), // Toggle the status
        });

        if (!response.ok) {
            throw new Error('Failed to toggle category status');
        }

        const updatedCategory = await response.json();
        return updatedCategory;
    } catch (error) {
        console.error('Error toggling category status:', error);
        throw error;
    }
};

// utils/subCategoryApi.js

// categoryApi.js
export const toggleSubCategoryStatus = async (id, active) => {
    const response = await fetch(`${baseUrl}/api/categories/subcategories/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }), // Send the `active` status
    });

    if (!response.ok) {
        throw new Error('Failed to update status');
    }

    const updatedSubCategory = await response.json();
    return updatedSubCategory;
};




export const createCategory = async ( name, type, image ) => {
    console.log( name, type, image);
    
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, image }),
    });
    return response.json();
};

export const updateCategory = async (id, name, type, image ) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, image }),
    });
    return response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const fetchSubCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/subcategories`);
    return response.json();
};

export const createSubCategory = async (name, categoryId, image) => {
    const response = await fetch(`${API_BASE_URL}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId, image }), // Include the image in the request body
    });
    return response.json();
};

export const updateSubCategory = async (id, name, categoryId, image) => {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId, image }), // Include the image in the request body
    });
    return response.json();
};

export const deleteSubCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};


export const fetchBrands = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
};

export const createBrand = async (name) => {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating brand:', error);
    }
};

export const updateBrand = async (id, name) => {
    try {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating brand:', error);
    }
};

export const deleteBrand = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/brands/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting brand:', error);
    }
};
