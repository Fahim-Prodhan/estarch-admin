import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import baseUrl from "../../../helpers/baseUrl";
import axios from 'axios';

const ShowroomProfit = () => {
    document.title = "Estarch | Showroom Profit";
    const [startDate, setStartDate] = useState(""); // State for start date
    const [endDate, setEndDate] = useState(""); // State for end date
    const [singleDate, setSingleDate] = useState(""); // State for single date filter
    const [data, setData] = useState({});

    useEffect(() => {
        // Fetch sales data based on the selected date filters
        const fetchFilteredData = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/orders/showroom-profit?startDate=${startDate}&endDate=${endDate}&singleDate=${singleDate}`);
                const result = await response.json();
                console.log(result);
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchFilteredData();
    }, [startDate, endDate, singleDate]);

    // Function to reset date filters
    const clearDates = () => {
        setStartDate("");  // Reset startDate to an empty string
        setEndDate("");    // Reset endDate to an empty string
        setSingleDate(""); // Reset singleDate to an empty string
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Showroom Profit" />

                    <div className="bg-gray-100 flex items-center justify-center">
                        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">

                            {/* Date Range Filter */}
                            <div className="mb-4 space-y-2">
                                <h2 className="text-lg font-semibold mb-2">Filter by Date Range</h2>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border rounded p-2"
                                />
                                <span>To </span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border rounded p-2"
                                />
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                                    onClick={clearDates} // Call the clearDates function
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Single Date Filter */}
                            <div className="mb-4 space-y-2">
                                <h2 className="text-lg font-semibold mb-2">Filter by Single Date</h2>
                                <input
                                    type="date"
                                    value={singleDate}
                                    onChange={(e) => setSingleDate(e.target.value)}
                                    placeholder="Choose Your Date"
                                    className="border p-2 rounded"
                                />
                                <br />
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                                    onClick={clearDates} // Call the clearDates function
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
                                <h2 className="text-xl text-white"> Sales</h2>
                                <p className="text-2xl font-semibold">{data.totalSellAmount} ৳ </p>
                            </div>
                            <div className="bg-green-500 text-white p-4 rounded-lg">
                                <h2 className="text-xl text-white"> Profit</h2>
                                <p className="text-2xl font-semibold">{data.totalProfit} ৳ </p>
                            </div>

                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ShowroomProfit;
