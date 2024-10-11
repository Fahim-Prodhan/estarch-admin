import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MdDeleteSweep } from "react-icons/md";
import "../../../assets/scss/datatables.scss";
import baseUrl from "../../../helpers/baseUrl";
import { TiTick } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import axios from "axios";
const ExpenseList = () => {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [selectedItem, setSelectedItem] = useState(null); 
  const [refresh, setRefresh] = useState(false)
  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, 
    };
    return date.toLocaleString('en-US', options);
  }
  const handleApprove = async (expenseId) => {
    try {
      const response = await axios.put(`${baseUrl}/api/expenses/expenses/approve/${expenseId}`);
      alert(response.data.message);
      setRefresh(!refresh)
    } catch (err) {
      alert('Failed to approve the expense');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item); 
    document.getElementById('my_modal_2').showModal();
  };
  const handleDelete = async (rowId) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/expenses/expenses/${rowId}`);
      alert(response.data.message); 
      setRefresh(!refresh)
    } catch (err) {
      console.error("Failed to delete the expense:", err);
      alert("Failed to delete the expense. Please try again.");
    }
  };
  useEffect(() => {
    fetch(`${baseUrl}/api/expenses/expenses`)
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Date", field: "date", sort: "asc", width: 150 },
            {
              label: "Expense Type", field: "expenseType", sort: "asc", width: 150,
            },
            { label: "Amount", field: "amount", sort: "asc", width: 100 },
            { label: "Status", field: "status", sort: "asc", width: 100 },
            { label: "Action", field: "action", sort: "asc", width: 200, default: "", },
          ],
          rows: data.map(item => ({
            date: formatDateTime(item.createdAt),
            expenseType: (
              <p className="p-1 bg-blue-500 text-white rounded-md text-center w-20">
                {item.expenseType}
              </p>
            ),
            paymentType: item.paymentType,
            amount: item.amount,
            status: item.isApprove ? 'Approved' : 'Pending',
            action: (
              <div className="flex gap-3">
                <button className="text-2xl text-success" onClick={() => handleViewDetails(item)}>
                  <FaEye />
                </button>
                {
                  item.isApprove ? null : <> <button className="text-2xl text-success" onClick={() => handleApprove(item._id)}>
                    <TiTick />
                  </button>
                    <button
                      className="text-2xl text-error"
                      onClick={() => handleDelete(item._id)}
                    >
                      <MdDeleteSweep />
                    </button></>
                }
              </div>
            ),
          })),
        };

        setData(formattedData);
      });
  }, [refresh]);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Expense" />
          <div className="">
            <p className="w-full bg-gray-600 opacity-5 text-white p-2 font-bold text-2xl mt-4">
              Expense List
            </p>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <MDBDataTable responsive bordered data={data} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <dialog id="my_modal_2" className="modal ">
            <div className="modal-box">
              {selectedItem && <p className="py-4">{selectedItem.details}</p>}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ExpenseList;
