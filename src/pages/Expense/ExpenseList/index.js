import React, { useState, useEffect } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { MDBDataTable } from "mdbreact"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"
import "../../../assets/scss/datatables.scss" // Ensure you have the appropriate styles

const ExpenseList = () => {
  const [data, setData] = useState({ columns: [], rows: [] })

  useEffect(() => {
    // Simulate fetching data from an API or static JSON file
    fetch("/expenseData.json")
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Date", field: "date", sort: "asc", width: 150 },
            {
              label: "Expense Type",field: "expenseType",sort: "asc",width: 150,},
            {label: "Payment Type",field: "paymentType",sort: "asc",width: 150,},
            { label: "Amount", field: "amount", sort: "asc", width: 100 },
            { label: "Details", field: "details", sort: "asc", width: 200 },
            {label: "Action", field: "action",sort: "asc", width: 100,default: "", },
          ],
          rows: data.map(item => ({
            date: item.date,
            expenseType: (
              <p className="p-1 bg-blue-500 text-white rounded-md text-center w-20">
                {item.expenseType}
              </p>
            ),
            paymentType: item.paymentType,
            amount: item.amount,
            details: item.details,
            action: (
              <div className="flex gap-2">
                <button className="text-2xl text-success">
                  <FaEdit />
                </button>
                <button
                  className="text-2xl text-error"
                  onClick={() => handleDelete(item.id)}
                >
                  <MdDeleteSweep />
                </button>
              </div>
            ),
          })),
        }

        setData(formattedData)
      })
  }, [])

  const handleDelete = rowId => {
    console.log(`Deleting row with id: ${rowId}`)
    // Add your deletion logic here
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Expense" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl mt-4">
              Expense List
            </p>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <CardBody>
                      <MDBDataTable responsive bordered data={data} />
                    </CardBody>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ExpenseList
