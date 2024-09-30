import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";
import baseUrl from "../../../helpers/baseUrl";

const CourierApi = () => {
    document.title = "Estarch | Courier Api";

    const [courier, setCourier] = useState(null);
    const [apiKey, setApiKey] = useState("");
    const [secretKey, setSecretKey] = useState("");

    useEffect(() => {
        // Fetch the courier data by ID
        axios.get(`${baseUrl}/api/courier`)
            .then((res) => {
                const data = res.data.data[0];
                setCourier(data);
                setApiKey(data.apiKey);  // Set default API key to input
                setSecretKey(data.secretKey);  // Set default Secret key to input
            })
            .catch((err) => {
                console.error("Error fetching courier data", err);
            });
    }, []);

    // Handle form submission for updating API data
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${baseUrl}/api/courier/66f1989c44445dbe2bce8c30`, {
                apiKey,
                secretKey,
            });

            alert("Courier API updated successfully!");
            setCourier(response.data.data);
        } catch (error) {
            console.error("Error updating courier data", error);
            alert("Failed to update Courier API.");
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Courier Api" />
                    <div className="shadow-lg pb-4">
                        <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
                            Courier Api
                        </p>
                        <form className="w-[40%] mt-4 ml-4" onSubmit={handleUpdate}>
                            <label className="input input-bordered flex items-center gap-2">
                              <span className="text-red-500"> API Key: </span>
                                <input 
                                    value={apiKey} 
                                    onChange={(e) => setApiKey(e.target.value)} 
                                    type="text" 
                                    className="grow" 
                                    placeholder="API Key" 
                                />
                            </label>
                            <label className="input input-bordered flex items-center gap-2 mt-3">
                               <span className="text-red-500"> Secret Key: </span>
                                <input 
                                    value={secretKey} 
                                    onChange={(e) => setSecretKey(e.target.value)} 
                                    type="text" 
                                    className="grow" 
                                    placeholder="Secret Key" 
                                />
                            </label>
                            
                            <button type="submit" className="btn btn-sm bg-primary text-white mt-3">
                                Update
                            </button>
                        </form>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CourierApi;
