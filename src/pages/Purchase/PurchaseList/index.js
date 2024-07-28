import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import pro_img from '../../../assets/images/product/img-1.png'
import pro_img1 from '../../../assets/images/product/img-2.png'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { MDBDataTable } from "mdbreact";

const PurchaseList = () => {
  const [data, setData] = useState({ columns: [], rows: [] })

  useEffect(() => {
    // Simulate fetching data from an API or static JSON file
    fetch("/purchaseData.json")
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Serial ID", field: "serialId", sort: "asc", width: 150 },
            { label: "Product", field: "product", sort: "asc", width: 200 },
            { label: "Supplier", field: "supplier", sort: "asc", width: 200 },
            { label: "Total Bill", field: "totalBill", sort: "asc", width: 100 },
            { label: "Status", field: "status", sort: "asc", width: 100 },
            { label: "Created", field: "created", sort: "asc", width: 150 },
            { label: "Note", field: "note", sort: "asc", width: 100 },
            { label: "Action", field: "action", sort: "asc", width: 100 },
          ],
          rows: data.map(item => ({
            serialId: (
              <div>
                <p>{item.serialId}</p>
                <p className="text-xs opacity-55">{item.created}</p>
              </div>
            ),
            product: (
              <div className="flex gap-2 items-center flex-wrap">
                <img className="w-20" src={item.product.image} alt={item.product.name} />
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  X
                  <p>{item.product.quantity}</p>
                </div>
              </div>
            ),
            supplier: (
              <div>
                <p className="font-bold text-warning">{item.supplier.name}</p>
                <p>{item.supplier.phone}</p>
                <p className="text-error">{item.supplier.company}</p>
              </div>
            ),
            totalBill: item.totalBill,
            status: <button className="text-white bg-success p-1 rounded-md">{item.status}</button>,
            created: "admin",
            note: item.note,
            action: (
              <div className="space-x-2">
                <button className="text-blue-500 text-xl"><FaRegEye /></button>
                <button className="text-error text-xl"><RiDeleteBin6Fill /></button>
              </div>
            ),
          })),
        }
        setData(formattedData)
      })
  }, [])


  document.title = "Estarch | Purchase List"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Purchase List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Purchase List
            </p>

            <div className="flex mt-4 mx-4 justify-between items-center flex-wrap">
              <form className="flex gap-2 flex-wrap">
                <select className="select select-bordered ">
                  <option disabled selected>
                    Filter
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>

                <label className="input input-bordered flex items-center gap-2">
                  <input type="text" className="grow" placeholder="Search" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
              </form>
              <p className="text-xl text-success font-bold">
                Total Purchase: 35
              </p>
            </div>

            {/* table */}

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

export default PurchaseList
