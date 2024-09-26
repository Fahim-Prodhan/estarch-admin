import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { Breadcrumbs } from '@material-ui/core';
import baseUrl from '../../../helpers/baseUrl';

const HomeElement = () => {
    const [visibleTable, setVisibleTable] = useState('carousel');
    const [isCarouselModalOpen, setCarouselModalOpen] = useState(false);
    const [isVideoModalOpen, setVideoModalOpen] = useState(false);
    const [isHomeImageModalOpen, setHomeImageModalOpen] = useState(false);
    const [carouselImages, setCarouselImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [link, setLink] = useState('');
    const [editingCarouselId, setEditingCarouselId] = useState(null);
    const [homeImages, setHomeImages] = useState([]);
    const [selectedHomeImages, setSelectedHomeImages] = useState([]);
    const [homeImagePreviews, setHomeImagePreviews] = useState([]);
    const [homeImageLink, setHomeImageLink] = useState('');
    const [editingHomeImageId, setEditingHomeImageId] = useState(null);
    const [HomeImageName, setHomeImageName] = useState('');
    const [videoName, setVideoName] = useState('');
    const [videos, setVideos] = useState([]);
    console.log(videos);

    const [videoLink, setVideoLink] = useState('');
    const [editingVideoId, setEditingVideoId] = useState(null);
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/video?showAll=true`);
                const data = await response.json();
                setVideos(data);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        fetchVideoData();
    }, []);

    const handleVideoSubmit = async () => {
        try {
            if (editingVideoId) {
                // Update existing video
                const response = await fetch(`${baseUrl}/api/video/${editingVideoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        videoLink,
                        videoName,
                    }),
                });
                if (!response.ok) {
                    console.error('Failed to update video');
                    return;
                }
                const updatedVideo = await response.json();
                setVideos(videos.map(video =>
                    video._id === editingVideoId ? updatedVideo : video
                ));
            } else {
                // Add new video
                const response = await fetch(`${baseUrl}/api/video`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        videoLink,
                        videoName,
                    }),
                });
                if (!response.ok) {
                    console.error('Failed to upload video');
                    return;
                }
                const newVideo = await response.json();
                setVideos([...videos, newVideo]);
            }

            closeVideoModal();
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };


    const handleVideoEdit = (id) => {
        openVideoModal(id);
    };

    const handleVideoDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/api/video/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setVideos(videos.filter(video => video._id !== id));
            } else {
                console.error('Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleVideoToggleActive = async (id, currentStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/video/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (response.ok) {
                const updatedVideo = await response.json();
                setVideos(videos.map(video =>
                    video._id === id ? updatedVideo : video
                ));
            } else {
                console.error('Failed to update video status');
            }
        } catch (error) {
            console.error('Error updating video status:', error);
        }
    };

    const openVideoModal = (videoId = null) => {
        setEditingVideoId(videoId);
        setVideoModalOpen(true);
    };


    const closeVideoModal = () => {
        setVideoModalOpen(false);
        setEditingVideoId(null);
        setVideoLink('');
    };

    useEffect(() => {
        const fetchHomeImageData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/home-image?showAll=true`);
                const data = await response.json();
                setHomeImages(data);
            } catch (error) {
                console.error('Error fetching home image data:', error);
            }
        };

        fetchHomeImageData();
    }, []);
    const handleHomeImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedHomeImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setHomeImagePreviews(previews);
    };
    const handleHomeImageSubmit = async () => {
        const formData = new FormData();
        Array.from(selectedHomeImages).forEach(image => {
            formData.append('images', image);
        });
        formData.append('link', homeImageLink);
        formData.append('name', HomeImageName);

        try {
            const url = editingHomeImageId
                ? `${baseUrl}/api/home-image/${editingHomeImageId}`
                : `${baseUrl}/api/home-image`;
            const method = editingHomeImageId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to upload home images:', errorText);
                return;
            }

            const updatedHomeImage = await response.json();
            if (editingHomeImageId) {
                setHomeImages(homeImages.map(homeImage =>
                    homeImage._id === editingHomeImageId ? updatedHomeImage : homeImage
                ));
            } else {
                setHomeImages([...homeImages, updatedHomeImage]);
            }

            closeSetImageModal();
        } catch (error) {
            console.error('Error uploading home images:', error);
        }
    };
    const handleHomeImageDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/api/home-image/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setHomeImages(homeImages.filter(homeImage => homeImage._id !== id));
            } else {
                console.error('Failed to delete home image');
            }
        } catch (error) {
            console.error('Error deleting home image:', error);
        }
    };
    const handleHomeImageEdit = (id) => {
        const homeImage = homeImages.find(homeImage => homeImage._id === id);
        if (homeImage) {
            setHomeImagePreviews(homeImage.images.map(image => `${baseUrl}/${image}`));
            setHomeImageLink(homeImage.link);
            setHomeImageName(homeImage.name);
            setEditingHomeImageId(id);
            openHomeImageModal();
        }
    };

    const handleHomeImageToggleActive = async (id, currentStatus) => {
        try {
            const response = await fetch(`${baseUrl}/api/home-image/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (response.ok) {
                const updatedHomeImage = await response.json();
                setHomeImages(homeImages.map(homeImage =>
                    homeImage._id === id ? updatedHomeImage : homeImage
                ));
            } else {
                console.error('Failed to update home image status');
            }
        } catch (error) {
            console.error('Error updating home image status:', error);
        }
    };

    const openCarouselModal = (carouselId = null) => {
        setEditingCarouselId(carouselId);
        if (carouselId) {
            const carousel = carouselImages.find(carousel => carousel._id === carouselId);
            if (carousel) {
                setImagePreviews(carousel.images.map(image => `${baseUrl}/${image}`));
                setLink(carousel.link);
            }
        }
        setCarouselModalOpen(true);
    };
    const closeCarouselModal = () => {
        setCarouselModalOpen(false);
        setSelectedImages([]);
        setImagePreviews([]);
        setEditingCarouselId(null);
        setLink('');
    };

    const openHomeImageModal = () => setHomeImageModalOpen(true);

    const closeSetImageModal = () => setHomeImageModalOpen(false);
    // useEffect(() => {
    //     const fetchCarouselData = async () => {
    //         try {
    //             const response = await fetch(`${baseUrl}/api/carosul`);
    //             const data = await response.json();
    //             setCarouselImages(data);
    //         } catch (error) {
    //             console.error('Error fetching carousel data:', error);
    //         }
    //     };

    //     fetchCarouselData();
    // }, []);
    useEffect(() => {
        const fetchCarousels = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/carosul?showAll=true`);
                const data = await response.json();
                setCarouselImages(data);
            } catch (error) {
                console.error('Error fetching carousels:', error);
            }
        };

        fetchCarousels();
    }, []);
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };
    const handleCarouselSubmit = async () => {
        const formData = new FormData();
        Array.from(selectedImages).forEach(image => {
            formData.append('images', image);
        });
        formData.append('link', link);
        try {
            const url = editingCarouselId
                ? `${baseUrl}/api/carosul/${editingCarouselId}`
                : `${baseUrl}/api/carosul`;
            const method = editingCarouselId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to upload images:', errorText);
                return;
            }
            const updatedCarousel = await response.json();
            if (editingCarouselId) {
                setCarouselImages(carouselImages.map(carousel =>
                    carousel._id === editingCarouselId ? updatedCarousel : carousel
                ));
            } else {
                setCarouselImages([...carouselImages, updatedCarousel]);
            }
            closeCarouselModal();
        } catch (error) {
            console.error('Error uploading images:', error);
        }
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
    const handleEdit = (id) => {
        openCarouselModal(id);
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


    return (
        <React.Fragment>
            <div className="page-content py-6">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Home Element" className="mb-4" />
                    <div className="flex space-x-4 mt-20 mb-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            onClick={() =>
                                setVisibleTable('carousel')}
                        // onClick={() => openCarouselModal()}
                        >
                            Add Carousel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            onClick={() =>

                                setVisibleTable('homeImage')
                            }

                        >
                            Home Image
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                            onClick={() =>
                                setVisibleTable('video')

                            }
                        >
                            Add Video
                        </button>
                    </div>
                    {visibleTable === 'carousel' && (


                        <div className="bg-white shadow-md rounded-md overflow-hidden">
                            <div className='flex justify-center mt-10'>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => openCarouselModal()}
                                >
                                    Add Carousel +
                                </button>
                            </div>
                            <table className="min-w-full border-collapse border border-gray-300 mt-10 mb-20">
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
                                                    className="toggle toggle-primary" />
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
                    )}
                    {visibleTable === 'video' &&

                        <div className="bg-white shadow-md rounded-md overflow-hidden">
                            <div className='flex justify-center mt-10'>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 "
                                    onClick={() =>

                                        openVideoModal()
                                    }
                                >
                                    Add Video +
                                </button>
                            </div>
                            <table className="min-w-full mt-10 border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-blue-600 text-white">
                                        <th className="border border-gray-300 p-3">ID</th>
                                        <th className="border border-gray-300 p-3">Name</th>
                                        <th className="border border-gray-300 p-3">Link</th>
                                        <th className="border border-gray-300 p-3">Active</th>
                                        <th className="border border-gray-300 p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video, index) => (

                                        <tr key={video._id}>
                                            <td className="border border-gray-300 p-3">{index + 1}</td>
                                            <td className="border border-gray-300 p-3">
                                                {video.name}
                                            </td>
                                            <td className="border border-gray-300 p-3">{video.link}</td>
                                            <td className="border border-gray-300 p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={video.active}
                                                    onChange={() => handleVideoToggleActive(video._id, video.active)}
                                                    className="toggle toggle-primary"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-3">
                                                <button onClick={() => handleVideoEdit(video._id)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200 mr-2">Edit</button>
                                                <button onClick={() => handleVideoDelete(video._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    {visibleTable === 'homeImage' && (
                        <div className="bg-white shadow-md rounded-md overflow-hidden">
                            <div className='mt-10 flex justify-center'>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => {
                                        openHomeImageModal();

                                    }
                                    }
                                >Add Home Image + </button>
                            </div>
                            <table className="min-w-full  mt-10 border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-green-600 text-white">
                                        <th className="border border-gray-300 p-3">ID</th>
                                        <th className="border border-gray-300 p-3">Name</th>
                                        <th className="border border-gray-300 p-3">Images</th>
                                        <th className="border border-gray-300 p-3">Link</th>
                                        <th className="border border-gray-300 p-3">Active</th>
                                        <th className="border border-gray-300 p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {homeImages.map((home, index) => (
                                        <tr key={home._id}>
                                            <td className="border border-gray-300 p-3">{index + 1}</td>
                                            <td className="border border-gray-300 p-3">{home.name}</td>
                                            <td className="border border-gray-300 p-3">
                                                {home.images.map((image, i) => (
                                                    <img key={i} src={`${baseUrl}/${image}`} alt="carousel" className={`w-20 h-20 object-cover ${home.active ? '' : 'opacity-50'}`} />
                                                ))}
                                            </td>
                                            <td className="border border-gray-300 p-3">{home.link}</td>
                                            <td className="border border-gray-300 p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={home.active}
                                                    onChange={() => handleHomeImageToggleActive(home._id, home.active)}
                                                    className="toggle toggle-primary" />
                                            </td>
                                            <td className="border border-gray-300 p-3">
                                                <button onClick={() => handleHomeImageEdit(home._id)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200 mr-2">Edit</button>
                                                <button onClick={() => handleHomeImageDelete(home._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {isCarouselModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4">
                                    {editingCarouselId ? 'Update Images' : 'Add Multiple Images'}
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
                                        {editingCarouselId ? 'Update' : 'Submit'}
                                    </button>
                                </form>
                                <button
                                    type="button"
                                    onClick={closeCarouselModal}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {isVideoModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4">
                                    {editingVideoId ? 'Update Video' : 'Add New Video'}
                                </h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleVideoSubmit(); }}>
                                    <input
                                        type="text"
                                        className="mb-4 w-full border border-gray-300 p-2 rounded-md"
                                        placeholder="Enter video name"
                                        value={videoName}
                                        onChange={(e) => setVideoName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={videoLink}
                                        onChange={(e) => setVideoLink(e.target.value)}
                                        placeholder="Video Link"
                                        className="mb-4 w-full p-2 border border-gray-300 rounded"
                                    />

                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        {editingVideoId ? 'Update Video' : 'Add Video'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeVideoModal}
                                        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    {isHomeImageModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4">Add Home Image</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleHomeImageSubmit(); }}>
                                    <input
                                        type="text"
                                        className="mb-4 w-full border border-gray-300 p-2 rounded-md"
                                        placeholder="Enter home image name"
                                        value={HomeImageName}
                                        onChange={(e) => setHomeImageName(e.target.value)}
                                    />
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="mb-4 w-full"
                                        onChange={handleHomeImageSelect}
                                    />

                                    <input
                                        type="text"
                                        value={homeImageLink}
                                        onChange={(e) => setHomeImageLink(e.target.value)}
                                        placeholder="Link"
                                        className="mb-4 w-full p-2 border border-gray-300 rounded"
                                    />
                                    <div className="mb-4">
                                        {homeImagePreviews.map((preview, index) => (
                                            <img key={index} src={preview} alt={`preview ${index}`} className="w-20 h-20 object-cover mr-2" />
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        {editingHomeImageId ? 'Update' : 'Submit'}
                                    </button>
                                </form>
                                <button
                                    type="button"
                                    onClick={closeSetImageModal}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default HomeElement;
