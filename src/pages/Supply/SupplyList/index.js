import React from "react"
import { Container } from "reactstrap"
import { MdDeleteSweep } from "react-icons/md"
import { FaEdit } from "react-icons/fa"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const Refund = () => {
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

export default Refund
