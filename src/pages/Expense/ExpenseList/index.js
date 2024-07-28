import React, { useState } from "react"
import { Container } from "reactstrap"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"

const ExpenseList = () => {
  document.title = "Estarch | Create Expense"

  const [startDate, setStartDate] = useState(new Date())

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Expense" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl mt-4">
              Expense List
            </p>

            <div className="flex my-4 items-center gap-4 flex-wrap ml-4">
            <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Expense Type
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
                <p className="text-xl  font-bold text-error">3 items: 1200 Tk</p>
            </div>

            {/* table */}

            <div className="overflow-x-auto ">
              <table className="table table-zebra ">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Expense Type</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                    <th>Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="pl-4">
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>
                      <p>24 May,2024</p>
                    </td>

                    <td>
                        <p className="p-1 bg-blue-500 text-white rounded-md text-center w-20">Fahim</p>
                    </td>

                    <td>Cash</td>

                    <td>2000 Tk</td>

                    <td>Details Will Show Here</td>

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
                  {/* row 1 */}
                  <tr>
                    <th>2</th>
                    <td>
                      <p>15 May,2024</p>
                    </td>

                    <td>
                        <p className="p-1 bg-blue-500 text-white rounded-md text-center w-20">Jewel</p>
                    </td>

                    <td>Cash</td>

                    <td>5000 Tk</td>

                    <td>Details Will Show Here</td>

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
                  {/* row 1 */}
                  <tr>
                    <th>3</th>
                    <td>
                      <p>4 May,2024</p>
                    </td>

                    <td>
                        <p className="p-1 bg-blue-500 text-white rounded-md text-center w-20">Riyadh</p>
                    </td>

                    <td>Cash</td>

                    <td>6000 Tk</td>

                    <td>Details Will Show Here</td>

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

export default ExpenseList
