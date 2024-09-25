import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import InvestModal from "./InvestModal"; // Import the modal component
import baseUrl from "../../../helpers/baseUrl";
import axios from "axios";
import MyRequestsModal from "./MyRequestsModal";
import IncomingRequestModal from "./IncomingRequestsModal";

const MyInvestorAccount = () => {
  document.title = "Estarch | My Investor Account";
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(1)


  const [showModal, setShowModal] = useState(false);
  const [showMyRequestModal, setShowMyRequestModal] = useState(false);
  const [showMyIncomingRequestModal, setShowMyIncomingRequestModal] = useState(false);
  const [myIncomingRequests, setMyIncomingRequests] = useState([])
  const [myRequests, setRequests] = useState([])
  const [myTransaction, setMyTransaction] = useState([])
  const [myAccount, setMyAccount] = useState(null)

  const pageRange = 2;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };


  const onPageChange = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    setCurrentPage(page);
  };

  const fetchMyAccount = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }

      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/account/investor/${userId}`);

      // Set the response data in state
      setMyAccount(response.data);

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchIncomingRequest = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }

      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/transaction/get-notification/${userId}`);

      // Set the response data in state
      setMyIncomingRequests(response.data);

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchRequest = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }

      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/transaction/get-transaction/${userId}`);

      // Set the response data in state
      setRequests(response.data);

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchMyAllTransaction = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }
      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/transaction/get-my-transaction/${userId}?page=${currentPage}&size=${limit}&search=${search}`);

      // Set the response data in state
      setMyTransaction(response.data.transactions);
      setCount(response.data.totalTransaction)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setLoading(false)

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const allFetchingFun = () => {
    fetchIncomingRequest();
    fetchRequest();
    fetchMyAllTransaction();
    fetchMyAccount();
  }

  useEffect(() => {
    allFetchingFun()
  }, [currentPage,limit])

  const handleModalOpen = () => setShowModal(true); // Function to show modal
  const handleModalClose = () => setShowModal(false); // Function to close modal
  const handleMyRequestModalOpen = () => setShowMyRequestModal(true); // Function to show modal
  const handleMyRequestModalClose = () => setShowMyRequestModal(false); // Function to close modal
  const handleMyIncomingRequestModalOpen = () => setShowMyIncomingRequestModal(true); // Function to show modal
  const handleMyIncomingRequestModalClose = () => setShowMyIncomingRequestModal(false); // Function to close modal

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem={`Investor Account of ${myAccount?.investorName}`} />
          <div className="">

            <div className="shadow-md p-2 mb-4 rounded-md">
              {/* Grid section */}
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-6 my-4">
                <div className="shadow-md cursor-pointer text-center py-2 bg-[#af47d223]">
                  <p className="font-semibold text-[#AF47D2] text-2xl  m-0">Total Invested amount</p>
                  <p className="text-2xl font-bold text-[#AF47D2]">{myAccount?.investedAmount} ৳</p>
                </div>

                <div className="shadow-md cursor-pointer text-center py-2 bg-[#1b424225]">
                  <p className="font-semibold text-[#1B4242] text-2xl  m-0">Total withdrawal Amount</p>
                  <p className="text-2xl font-bold text-[#1B4242]"> {myAccount?.withdrawAmount} ৳</p>
                </div>

                <div className="shadow-md cursor-pointer text-center py-2 bg-[#40a57821]">
                  <p className="font-bold text-[#40A578] text-2xl m-0">Net Invested Amount</p>
                  <p className="text-2xl font-bold text-[#40A578]">{myAccount?.investedAmount - myAccount?.withdrawAmount} ৳</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="my-4 flex gap-4">
                <button
                  className="btn btn-sm btn-primary text-white"
                  onClick={handleModalOpen} // Open modal on click
                >
                  Invest +
                </button>
                <button onClick={handleMyRequestModalOpen} className="btn btn-sm bg-orange-400 text-white">
                  My Pending Request +{myRequests.length}
                </button>
                <button onClick={handleMyIncomingRequestModalOpen} className="btn btn-sm btn-error text-white">
                  Incoming Request +{myIncomingRequests?.length}
                </button>
              </div>
            </div>

            {/* Table section */}
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>

                    <div className="overflow-x-auto overflow-y-hidden">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="border-2 border-gray-200">Serial</th>
                            <th className="border-2 border-gray-200">Transaction ID</th>
                            <th className="border-2 border-gray-200">Type</th>
                            <th className="border-2 border-gray-200">Account Type</th>
                            <th className="border-2 border-gray-200">Payment Option</th>
                            <th className="border-2 border-gray-200">Sender</th>
                            <th className="border-2 border-gray-200">Receiver</th>
                            <th className="border-2 border-gray-200">Amount</th>
                            <th className="border-2 border-gray-200">Date</th>
                            <th className="border-2 border-gray-200">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            myTransaction.map((t, index) =>
                              <tr>
                                <td className="border-2 border-gray-200">{index + 1}</td>
                                <td className="border-2 border-gray-200">{t.tId}</td>
                                <td className="border-2 border-gray-200 text-center">{t.type}</td>
                                <td className="border-2 border-gray-200 text-center">{t.accountType}</td>
                                <td className="border-2 border-gray-200 text-center">{t.paymentOption}</td>
                                <td className="border-2 border-gray-200 text-center">{t.senderId.fullName}</td>
                                <td className="border-2 border-gray-200 text-center">{t.receiverId.fullName}</td>
                                <td className="border-2 border-gray-200 text-center">{t.amount} ৳</td>
                                <td className="border-2 border-gray-200 text-center">
                                  <p className="font-bold">
                                    {`${('0' + new Date(t.createdAt).getDate()).slice(-2)}-${('0' + (new Date(t.createdAt).getMonth() + 1)).slice(-2)}-${new Date(t.createdAt).getFullYear().toString().slice(-2)}, ${new Date(t.createdAt).getHours() % 12 || 12}:${('0' + new Date(t.createdAt).getMinutes()).slice(-2)} ${new Date(t.createdAt).getHours() >= 12 ? 'PM' : 'AM'}`}
                                  </p>
                                </td>
                                <td className="border-2 border-gray-200 text-center">
                                  <p className={`px-2 py-1 rounded-md text-sm ${t.isDecline ? 'text-red-500' :
                                    t.isApprove ? 'text-green-500' :
                                      'text-orange-500 bg-orange-100'
                                    }`}>
                                    {t.isApprove ? "Accepted" : t.isDecline ? "Declined" : "Pending"}
                                  </p>
                                </td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                      >
                        Prev
                      </button>

                      {getPageNumbers().map((pageNumber, index) => {
                        if (pageNumber === '...') {
                          return (
                            <span key={index} className="px-4 py-2 mx-1 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={index}
                            onClick={() => onPageChange(pageNumber)}
                            className={`px-4 py-2 rounded mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                      >
                        Next
                      </button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          {/* Modal */}
          <InvestModal allFetchingFun={allFetchingFun} show={showModal} handleClose={handleModalClose} />
          <MyRequestsModal show={showMyRequestModal} myRequests={myRequests} handleClose={handleMyRequestModalClose} />
          <IncomingRequestModal allFetchingFun={allFetchingFun} show={showMyIncomingRequestModal} myRequests={myIncomingRequests} handleClose={handleMyIncomingRequestModalClose} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MyInvestorAccount;
