import React from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { MDBDataTable } from "mdbreact"
import "./datatables.scss"


const Refund = () => {
  const handleDelete = rowId => {
    console.log(`Deleting row with id: ${rowId}`)
    // Add your deletion logic here
  }

  const data = {
    columns: [
      {
        label: "Image",
        field: "image",
        sort: "asc",
        width: 150,
      },
      {
        label: "Name",
        field: "name",
        sort: "asc",
        width: 270,
      },
      {
        label: "Phone",
        field: "phone",
        sort: "asc",
        width: 200,
      },
      {
        label: "Address",
        field: "address",
        sort: "asc",
        width: 100,
      },
      {
        label: "Status",
        field: "status",
        sort: "asc",
        width: 150,
      },
      {
        label: "Action",
        field: "action",
        width: 100,
      },
    ],
    rows: [
      {
        image: (
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        ),
        name: <p className="font-bold text-warning">XYX</p>,
        phone: "017000000",
        address: "Mirpur",
        status: (
          <div className="flex flex-wrap gap-2">
          <p className="bg-blue-500 text-center text-white p-1 rounded-md w-1">
            Active
          </p>
          <input
            type="checkbox"
            className="toggle toggle-info"
            defaultChecked
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
        ), // Replace with unique ID or identifier
      },
      // Add more rows here...
    ],
  }

  document.title = "Estarch | Supply List"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Supply List" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Supply List
            </p>
            <div className=" mt-4">
              {/* table */}

              <div className="overflow-x-auto">
                <table className="table table-zebra ">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>1</th>
                      <td>
                        <div className="avatar">
                          <div className="w-24 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="font-bold text-warning">XYX</p>
                      </td>
                      <td>01700000</td>
                      <td>Dhaka</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <p className="bg-blue-500 text-center text-white p-1 rounded-md w-">
                            Active
                          </p>
                          <input
                            type="checkbox"
                            className="toggle toggle-info"
                            defaultChecked
                          />
                        </div>
                      </td>
                      <td className="">
                        <div className="flex flex-wrap gap-2">
                          <button className="text-2xl text-success">
                            <FaEdit />
                          </button>
                          <button className="text-2xl text-error">
                            <MdDeleteSweep />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>2</th>
                      <td>
                        <div className="avatar">
                          <div className="w-24 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="font-bold text-warning">XYX</p>
                      </td>
                      <td>01700000</td>
                      <td>Mirpur</td>
                      <td className="w-40">
                        <div className="flex flex-wrap gap-2 pr-0 mr-0 pl-0 ml-0">
                          <p className="bg-blue-500 text-center text-white p-1 rounded-md">
                            Active
                          </p>
                          <input
                            type="checkbox"
                            className="toggle toggle-info "
                            defaultChecked
                          />
                        </div>
                      </td>
                      <td className="">
                        <div className="flex flex-wrap gap-2">
                          <button className="text-2xl text-success">
                            <FaEdit />
                          </button>
                          <button className="text-2xl text-error">
                            <MdDeleteSweep />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

export default Refund
