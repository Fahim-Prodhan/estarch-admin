import React from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { MDBDataTable } from "mdbreact"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"

const Brand = () => {
  document.title = "Estarch | Brand"

  const data = {
    columns: [
      { label: "Serial", field: "serial", sort: "asc", width: 100 },
      { label: "Brand Name", field: "name", sort: "asc", width: 100 },
      { label: "Feature", field: "feature", sort: "asc", width: 200 },
      { label: "Enable", field: "enable", sort: "asc", width: 150 },
      { label: "Action", field: "action", width: 100 },
    ],
    rows: [
      {
        serial: <p>1</p>,
        name: <p>POLO</p>,
        feature: (
            <div className="flex flex-wrap gap-2">
            <p
              className={`bg-${
                "InActive" === "Active" ? "blue" : "red"
              }-500 text-center text-white p-1 rounded-md w-1`}
            >
              InActive
            </p>
            <input
              type="checkbox"
              className="toggle toggle-info"
              defaultChecked={"InActive" === "Active"}
            />
          </div>
        ),
        enable: (
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
            <button className="text-2xl text-error">
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
          <Breadcrumbs title="Estarch" breadcrumbItem="Brand" />
          <div>
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Brand
            </p>

            {/* form */}
            <form className="mt-4 mx-4 gap-3 grid grid-cols-1">
              <div>
                <label className="label py-0 pl-2">
                  <span className="label-text">Brand Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Brand name"
                  className="input input-bordered w-full max-w-xs"
                  required
                />
              </div>

              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
              />
              <div className="flex gap-1">
                <label className="label py-0 ">
                  <span className="label-text">Feature: </span>
                </label>
                <input
                  type="checkbox"
                  className="toggle toggle-error"
                  defaultChecked
                />
              </div>
              <div className="flex ga'">
                <label className="label py-0 ">
                  <span className="label-text">Enable:</span>
                </label>
                <input
                  type="checkbox"
                  className="toggle toggle-success "
                  defaultChecked
                />
              </div>

              <button className="btn btn-sm btn-success text-white w-32">
                Save Attribute
              </button>
            </form>

            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl mt-12">
              Brand List
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

export default Brand
