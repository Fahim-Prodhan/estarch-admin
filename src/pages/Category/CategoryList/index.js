import React from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import pro_img from '../../../assets/images/product/img-1.png'

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"


const CategoryList = () => {
  const handleDelete = rowId => {
    console.log(`Deleting row with id: ${rowId}`)
    // Add your deletion logic here
  }


  document.title = "Estarch | Category List"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Category List" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Category List
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
                      <th>Category</th>
                      <th>Parent</th>
                      <th>Feature</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th>1</th>
                      <td>
                        <div className="avatar">
                          <div className="w-24 rounded-md">
                            <img src={pro_img} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="font-bold text-warning">Knit Denim</p>
                      </td>
                      <td>Jeans</td>
                    
                      <td>
                        <div className="flex flex-wrap gap-2">
                    
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
                          <div className="w-24 rounded-md">
                            <img src={pro_img} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="font-bold text-warning">Woven Denim</p>
                      </td>
                      <td>Jeans</td>
                      <td className="w-40">
                        <div className="flex flex-wrap gap-2 pr-0 mr-0 pl-0 ml-0">
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
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CategoryList
