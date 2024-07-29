import React from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { MDBDataTable } from "mdbreact"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"

const MainAttribute = () => {
  document.title = "Estarch | Main Attribute"

  const data = {
    columns: [
      { label: "Serial", field: "serial", sort: "asc", width: 100 },
      { label: "Attribute Name", field: "name", sort: "asc", width: 100 },
      { label: "Value", field: "value", sort: "asc", width: 200 },
      { label: "Status", field: "status", sort: "asc", width: 150 },
      { label: "Action", field: "action", width: 100 },
    ],
    rows: [
      {
        serial: <p>1</p>,
        name: <p>Size</p>,
        value: (
            <div className="flex gap-2">
                <p className="bg-base-300 p-1 rounded-3xl text-center">s</p>
                <p className="bg-base-300 p-1 rounded-3xl text-center">L</p>
                <p className="bg-base-300 p-1 rounded-3xl text-center">M</p>
                <p className="bg-base-300 p-1 rounded-3xl text-center">XL</p>
                <p className="bg-base-300 p-1 rounded-3xl text-center">XXL</p>
            </div>
        ),
        status: (
          <div className="flex flex-wrap gap-2">
            <p
              className={`bg-${
                "Active" === "Active" ? "blue" : "red"
              }-500 text-center text-white p-1 rounded-md w-1`}
            >
              Active
            </p>
            <input
              type="checkbox"
              className="toggle toggle-info"
              defaultChecked={"Active" === "Active"}
            />
          </div>
        ),
        action: (
          <div className="flex flex-wrap gap-2">
            <button className="text-2xl text-success">
              <FaEdit />
            </button>
            <button
              className="text-2xl text-error"
              
            >
              <MdDeleteSweep />
            </button>
          </div>
        ),
      },
    ],
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Main Attribute" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Attribute
            </p>
            <div className="mt-4 ml-4 gap-3">
              <label className="label">
                <span className="label-text">Attribute Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter attribute name"
                className="input input-bordered w-full max-w-xs"
                required
              />
              <br />
              <input
                type="checkbox"
                className="toggle toggle-accent mt-4"
                defaultChecked
              />
              <br />
              <button className="btn btn-sm btn-success text-white mt-4">
                Save Attribute
              </button>
            </div>

            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl mt-12">
              Attribute List
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
        </Container>
      </div>
    </React.Fragment>
  )
}

export default MainAttribute
