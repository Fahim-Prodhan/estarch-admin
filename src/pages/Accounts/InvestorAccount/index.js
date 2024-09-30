import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AddInvestorModal from "./AddInvestorModal"; // Import the modal
import baseUrl from "../../../helpers/baseUrl";
import axios from "axios";
import altImg from '../../../assets/avater.jpg';

const InvestorAccount = () => {
    document.title = "Estarch | Investor Account";
    const [modalOpen, setModalOpen] = useState(false);
    const [newInvestor, setNewInvestor] = useState({});
    const [allInvestor, setAllInvestor] = useState([]);
    const [investingCalculation, setInvestingCalculation] = useState(null)

    const fetchInvestors = ()=>{
        try {
            axios.get(`${baseUrl}/api/account/investors`)
            .then(res => {
                setAllInvestor(res.data)
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    const fetchInvestingCalculation = ()=>{
        try {
            axios.get(`${baseUrl}/api/account/calculate-invested-balance`)
            .then(res => {
                setInvestingCalculation(res.data)
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(() => {
        fetchInvestors()
        fetchInvestingCalculation()
    }, [])

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvestor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewInvestor({ name: "", investedAmount: "" });
        toggleModal();

        axios.post(`${baseUrl}/api/auth/register-investor`, newInvestor)
            .then(res => {
                console.log(res.data);
                fetchInvestors()
            })
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Estarch" breadcrumbItem="Investor Account" />
                    <div className="">
                        <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">Investor Accounts</p>
                        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-6 mb-8">
                            <div className="shadow-md cursor-pointer text-center py-4 bg-[#40a57821]">
                                <p className="font-bold text-[#40A578] text-xl m-0">Total Invested Amount</p>
                                <p className="text-xl font-bold text-[#40A578]">{investingCalculation?.totalInvest} ৳</p>
                            </div>
                            <div className="shadow-md cursor-pointer text-center py-4 bg-[#e6a1462e]">
                                <p className="font-bold text-[#e6a146] text-xl m-0">Total Withdraw Amount</p>
                                <p className="text-xl font-bold text-[#e6a146]">{investingCalculation?.totalWithdraw} ৳</p>
                            </div>
                            <div className="shadow-md cursor-pointer text-center py-4 bg-[#328ae227]">
                                <p className="font-bold text-[#328ae2] text-xl m-0">Net Invested Amount</p>
                                <p className="text-xl font-bold text-[#328ae2]">{investingCalculation?.balance} ৳</p>
                            </div>
                        </div>
                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <div className='flex items-center '>
                                            <button className="btn btn-sm btn-primary text-white" onClick={toggleModal}>
                                                Add Investor
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto overflow-y-hidden">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>Serial</th>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>Name</th>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>Invested Amount</th>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>Withdrawal Amount</th>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>Net Amount</th>
                                                        <th className={`border-2 border-gray-200 border-opacity-75`}>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        allInvestor?.map((i,index) =>
                                                            <tr key={i?._id}>
                                                                <td className={`border-2 border-gray-200 border-opacity-75`}>{index+1}</td>
                                                                <td className={`border-2 border-gray-200 border-opacity-75`}><p>{i?.investorName}</p></td>
                                                                <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{i?.investedAmount}</td>
                                                                <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{i?.withdrawAmount}</td>
                                                                <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>{i?.investedAmount - i?.withdrawAmount}</td>
                                                               

                                                                <td className={`border-2 border-gray-200 border-opacity-75 text-center`}>
                                                                    <button className="btn btn-sm btn-accent text-white">Transaction</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            {/* Add Investor Modal */}
            <AddInvestorModal
                isOpen={modalOpen}
                onClose={toggleModal}
                newInvestor={newInvestor}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </React.Fragment>
    );
};

export default InvestorAccount;
