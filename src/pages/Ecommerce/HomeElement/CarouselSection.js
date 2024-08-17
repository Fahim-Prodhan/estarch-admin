import React, { useState, useEffect } from 'react';
import baseUrl from '../../../helpers/baseUrl';

const CarouselSection = () => {
    const [carouselImages, setCarouselImages] = useState([]);
    const [isCarouselModalOpen, setCarouselModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [link, setLink] = useState('');
    const [editingCarouselId, setEditingCarouselId] = useState(null);

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/carosul`);
                const data = await response.json();
                setCarouselImages(data);
            } catch (error) {
                console.error('Error fetching carousel data:', error);
            }
        };

        fetchCarouselData();
    }, []);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleCarouselSubmit = async () => {
        try {
            // Step 1: Upload Images
            const formData = new FormData();
            Array.from(selectedImages).forEach(image => {
                formData.append('images', image);
            });

            const uploadResponse = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                console.error('Image upload failed:', uploadResponse.statusText);
                return;
            }

            const uploadResult = await uploadResponse.json();
            const uploadedImages = uploadResult.files.map(file => file.url); // Assuming 'files' contains the uploaded file data

            // Step 2: Submit Carousel Data
            const carouselData = {
                images: uploadedImages,
                link,
            };
            console.log(carouselData);
            // const url = editingCarouselId
            //     ? `${baseUrl}/api/carosul/${editingCarouselId}`
            //     : `${baseUrl}/api/carosul`;
            // const method = editingCarouselId ? 'PUT' : 'POST';
            // const response = await fetch(url, {
            //     method,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(carouselData),
            // });

            // if (!response.ok) {
            //     console.error('Failed to submit carousel data:', response.statusText);
            //     return;
            // }

            // const updatedCarousel = await response.json();
            // if (editingCarouselId) {
            //     setCarouselImages(carouselImages.map(carousel =>
            //         carousel._id === editingCarouselId ? updatedCarousel : carousel
            //     ));
            // } else {
            //     setCarouselImages([...carouselImages, updatedCarousel]);
            // }

            closeCarouselModal();
        } catch (error) {
            console.error('Error submitting carousel:', error);
        }
    };


    const handleEdit = (id) => {
        openCarouselModal(id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/api/carosul/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCarouselImages(carouselImages.filter(carousel => carousel._id !== id));
            } else {
                console.error('Failed to delete carousel');
            }
        } catch (error) {
            console.error('Error deleting carousel:', error);
        }
    };
    const handleToggleActive = async (id, currentStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/carosul/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (response.ok) {
                const updatedCarousel = await response.json();
                setCarouselImages(carouselImages.map(carousel =>
                    carousel._id === id ? updatedCarousel : carousel
                ));
            } else {
                console.error('Failed to update carousel status');
            }
        } catch (error) {
            console.error('Error updating carousel status:', error);
        }
    };
    const openCarouselModal = (carouselId = null) => {
        setEditingCarouselId(carouselId);
        setCarouselModalOpen(true);
    };

    const closeCarouselModal = () => {
        setCarouselModalOpen(false);
        setSelectedImages([]);
        setImagePreviews([]);
        setEditingCarouselId(null);
        setLink('');
    };

    return (
        <div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="border border-gray-300 p-3">ID</th>
                            <th className="border border-gray-300 p-3">Images</th>
                            <th className="border border-gray-300 p-3">Link</th>
                            <th className="border border-gray-300 p-3">Active</th>
                            <th className="border border-gray-300 p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carouselImages.map((carousel, index) => (
                            <tr key={carousel._id}>
                                <td className="border border-gray-300 p-3">{index + 1}</td>
                                <td className="border border-gray-300 p-3">
                                    {carousel.images.map((image, i) => (
                                        <img key={i} src={`${baseUrl}/${image}`} alt="carousel" className={`w-20 h-20 object-cover ${carousel.active ? '' : 'opacity-50'}`} />
                                    ))}
                                </td>
                                <td className="border border-gray-300 p-3">{carousel.link}</td>
                                <td className="border border-gray-300 p-3">
                                    <input
                                        type="checkbox"
                                        checked={carousel.active}
                                        onChange={() => handleToggleActive(carousel._id, carousel.active)}
                                        className="toggle toggle-primary"
                                    />
                                </td>
                                <td className="border border-gray-300 p-3">
                                    <button onClick={() => handleEdit(carousel._id)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(carousel._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCarouselModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCarouselId ? 'Update Carousel' : 'Add New Carousel'}
                        </h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCarouselSubmit(); }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="mb-4 w-full"
                                onChange={handleImageSelect}
                            />
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Link"
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                            />
                            <div className="mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`preview ${index}`} className="w-20 h-20 object-cover mr-2" />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                {editingCarouselId ? 'Update Carousel' : 'Add Carousel'}
                            </button>
                            <button
                                type="button"
                                onClick={closeCarouselModal}
                                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarouselSection;
