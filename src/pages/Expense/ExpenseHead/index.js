import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit, FaRegEye } from "react-icons/fa"
import { RiDeleteBin6Fill } from "react-icons/ri"
import { MdDeleteSweep } from "react-icons/md"
import { MDBDataTable } from "mdbreact"

const ExpenseHead = () => {
  document.title = "Estarch | Expense Head"

  const [data, setData] = useState({ columns: [], rows: [] })

  const handleDelete = rowId => {
    console.log(`Deleting row with id: ${rowId}`)
    // Add your deletion logic here
  }


  useEffect(() => {
    fetch("/expenseHeadData.json")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const formattedData = {
          columns: [
            { label: "Serial", field: "serial", sort: "asc", width: 150 },
            { label: "Image", field: "image", sort: "asc", width: 150 },
            {
              label: "Name",
              field: "name",
              sort: "asc",
              width: 150,
            },
            {
              label: "Action",
              field: "action",
              sort: "asc",
              width: 100,
              default: "",
            },
          ],
          rows: data.map((item,index) => ({
            serial:<p>{index+1}</p>,
            image: (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={item.image} alt={item.name} />
                </div>
              </div>
            ),
            name: <p>{item.name}</p>,
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Expense Head" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Expense Head
            </p>
            <div className="w-[30%] mt-4 ml-4">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Enter Expense Head Name"
                />
                <span className="btn btn-sm btn-accent text-white">Add</span>
              </label>
            </div>
            <p className="mt-12 w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              List Of Expense Head
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

export default ExpenseHead
