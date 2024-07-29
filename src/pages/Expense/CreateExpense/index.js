import React, { useState } from "react"
import { Container } from "reactstrap"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"

const CreateExpense = () => {
  document.title = "Estarch | Create Expense"

  const [startDate, setStartDate] = useState(new Date())

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Expense" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Expense
            </p>
            <from className="lg:w-[60%] mx-auto grid md:grid-cols-2">
              <div className="form-control border-none">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <DatePicker
                  className="border-2  rounded-md w-full py-[12px] pl-4"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                />
              </div>

              <div className="form-control border-none">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input
                  name="amount"
                  type="number"
                  placeholder="amount"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control border-none">
                <select className="select select-bordered w-full">
                  <option disabled selected>
                    Expense Type
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>

              <div className="form-control border-none">
                <select className="select select-bordered w-full">
                  <option disabled selected>
                    Payment Type
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>

              <div className="form-control border-none md:col-span-2">
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  placeholder="Details"
                ></textarea>
              </div>

              <div className="form-control border-none md:col-span-2 place-self-center">
                <button className="btn btn-sm btn-success text-white w-40 mx-auto mb-2">
                  Save Expense
                </button>
              </div>
            </from>
    
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateExpense
