import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { MDBDataTable } from "mdbreact"
import "../../../assets/scss/datatables.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
const SupplyList = () => {
  const [data, setData] = useState({ columns: [], rows: [] })

  useEffect(() => {
    // Simulate fetching data from an API or static JSON file
    fetch("/supplyData.json")
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Image", field: "image", sort: "asc", width: 150 },
            { label: "Name", field: "name", sort: "asc", width: 270 },
            { label: "Phone", field: "phone", sort: "asc", width: 200 },
            { label: "Address", field: "address", sort: "asc", width: 100 },
            { label: "Status", field: "status", sort: "asc", width: 150 },
            { label: "Action", field: "action", width: 100 },
          ],
          rows: data.map(item => ({
            image: (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={item.image} alt={item.name} />
                </div>
              </div>
            ),
            name: <p className="font-bold text-warning">{item.name}</p>,
            phone: item.phone,
            address: item.address,
            status: (
              <div className="flex flex-wrap gap-2">
                <p className={`bg-${item.status === "Active" ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-1`}>
                  {item.status}
                </p>
                <input type="checkbox" className="toggle toggle-info" defaultChecked={item.status === "Active"} />
              </div>
            ),
            action: (
              <div className="flex flex-wrap gap-2">
                <button className="text-2xl text-success">
                  <FaEdit />
                </button>
                <button className="text-2xl text-error" onClick={() => handleDelete(item.id)}>
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

  document.title = "Estarch | Supply List"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Supply List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Supply List
            </p>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <MDBDataTable responsive bordered data={data} />
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

export default SupplyList
