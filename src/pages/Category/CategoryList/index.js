import React, { useState, useEffect } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { MDBDataTable } from "mdbreact"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"
import pro_img from "../../../assets/images/product/img-1.png" // Assuming the image is the same for all rows
import "../../../assets/scss/datatables.scss" // Ensure you have the appropriate styles

const CategoryList = () => {
  const [data, setData] = useState({ columns: [], rows: [] })

  useEffect(() => {
    // Simulate fetching data from an API or static JSON file
    fetch("/categoryData.json")
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Image", field: "image", sort: "asc", width: 150 },
            { label: "Category", field: "category", sort: "asc", width: 200 },
            { label: "Parent", field: "parent", sort: "asc", width: 150 },
            { label: "Feature", field: "feature", sort: "asc", width: 150 },
            { label: "Action", field: "action", sort: "asc", width: 100 },
          ],
          rows: data.map(item => ({
            image: (
              <div className="avatar">
                <div className="w-24 rounded-md">
                  <img src={item.image} alt={item.category} />
                </div>
              </div>
            ),
            category: <p className="font-bold text-warning">{item.category}</p>,
            parent: item.parent,
            feature: (
              <div className="flex flex-wrap gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  defaultChecked={item.feature}
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
          <Breadcrumbs title="Estarch" breadcrumbItem="Category List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Category List
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

export default CategoryList
