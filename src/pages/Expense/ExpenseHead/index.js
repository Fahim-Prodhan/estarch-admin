import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit, FaRegEye } from "react-icons/fa"
import { RiDeleteBin6Fill } from "react-icons/ri"
import { MdDeleteSweep } from "react-icons/md"

const ExpenseHead = () => {
  document.title = "Estarch | Expense Head"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Expense Head" />
          <div className="shadow-lg pb-4">
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

            {/* table */}

            <div className="overflow-x-auto ">
              <table className="table table-zebra ">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="pl-4">
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
                      <p>Fahim</p>
                    </td>

                    <td className="space-x-2">
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
                      <p>Riyadh</p>
                    </td>

                    <td className="space-x-2">
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
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>
                      <div className="avatar">
                        <div className="w-24 rounded-full">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>Shifat</p>
                    </td>

                    <td className="space-x-2">
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
                  {/* row 4 */}
                  <tr>
                    <th>4</th>
                    <td>
                      <div className="avatar">
                        <div className="w-24 rounded-full">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>Jewel</p>
                    </td>

                    <td className="space-x-2">
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
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ExpenseHead
