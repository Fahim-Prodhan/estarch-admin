import React, { useState } from "react"
import { Container } from "reactstrap"
import { IoIosAddCircle } from "react-icons/io"
import DatePicker from "react-datepicker"
import { BsFiletypeXls } from "react-icons/bs"

import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const Orders = () => {
  document.title = " Estarch | Orders"
  const [startDate, setStartDate] = useState(new Date())

  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
          <Breadcrumbs title="Estarch" breadcrumbItem="Orders" />
          {/* content Div */}
          <div>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {/* cards */}
              <div className="shadow-md text-center py-2 bg-[#4b70f52e]">
                <p className="text-2xl font-bold text-[#4B70F5]">312</p>
                <p className="font-semibold text-[#4B70F5]">ALL</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#ff7e3e1d]">
                <p className="text-2xl font-bold text-[#FF7F3E]">6</p>
                <p className="font-semibold text-[#FF7F3E]">PENDING</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#af47d223]">
                <p className="text-2xl font-bold text-[#AF47D2]">2</p>
                <p className="font-semibold text-[#AF47D2]">HOLDING</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#1b424225]">
                <p className="text-2xl font-bold text-[#1B4242]">56</p>
                <p className="font-semibold text-[#1B4242]">PROCESSING</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#40a57821]">
                <p className="text-2xl font-bold text-[#40A578]">56</p>
                <p className="font-semibold text-[#40A578]">CONFIRM</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#ff204d2a]">
                <p className="text-2xl font-bold text-[#FF204E]">56</p>
                <p className="font-semibold text-[#FF204E]">STOCK OUT</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#ff3ea523]">
                <p className="text-2xl font-bold text-[#FF3EA5]">56</p>
                <p className="font-semibold text-[#FF3EA5]">SHIPPED</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#620c9f21]">
                <p className="text-2xl font-bold text-[#610C9F]">56</p>
                <p className="font-semibold text-[#610C9F]">DELIVERED</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#fa58b616]">
                <p className="text-2xl font-bold text-[#FA58B6]">56</p>
                <p className="font-semibold text-[#FA58B6]">RETURNED</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#8b9a4619]">
                <p className="text-2xl font-bold text-[#8B9A46]">56</p>
                <p className="font-semibold text-[#8B9A46]">REFUND</p>
              </div>

              <div className="shadow-md text-center py-2 bg-[#c84a312a]">
                <p className="text-2xl font-bold text-[#C84B31]">56</p>
                <p className="font-semibold text-[#C84B31]">CANCELED</p>
              </div>

              {/* end card */}
            </div>

            {/*  */}
            <div className="mt-8 shadow-md bg-white px-8 py-4 flex flex-wrap gap-6 items-center">
              <div>
                <label className="mr-2"> Start date: </label>
                <DatePicker
                  className="border-2 py-2 rounded-md pl-4"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                />
              </div>

              <div>
                <label className="mr-2"> End date: </label>
                <DatePicker
                  className="border-2 py-2 rounded-md pl-4"
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                />
              </div>

              <button className="btn btn-sm bg-accent text-white">
                Filter
              </button>
              {/* <button className="btn btn-sm bg-red-500 text-white">
                Reset
              </button> */}
              <button className="btn btn-sm bg-blue-500 text-white ">
                <BsFiletypeXls /> Excel
              </button>
            </div>

            {/* order List */}
            <div className="mt-8">
              <div className="md:pl-4 text-white text-2xl font-bold bg-gray-600 py-3 flex md:justify-between flex-wrap justify-center gap-3">
                <p className="">Order List</p>
                <div className="flex gap-6 md:mr-4">
                  <button className="btn btn-sm bg-error text-white border-none">
                    <span>
                      <IoIosAddCircle className="text-xl" />
                    </span>
                    Pos Order
                  </button>
                  <button className="btn btn-sm bg-success text-white border-none">
                    My Orders
                  </button>
                </div>
              </div>

              {/* filter Div */}
              <div className="mt-2 grid grid-cols-2 lg:grid-cols-5 gap-4 items-center justify-center md:justify-start">
                <select className="select select-bordered w-full max-w-52">
                  <option disabled selected>
                    Filter By User
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>

                <select className="select select-bordered w-full max-w-52">
                  <option disabled selected>
                    Filter By Status
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
                <select className="select select-bordered w-full max-w-52">
                  <option disabled selected>
                    Filter By Courier
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
                <select className="select select-bordered w-full max-w-52">
                  <option disabled selected>
                    Filter By Employee
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>

                <select className="select select-bordered w-full max-w-52">
                  <option disabled selected>
                    Filter By Order Source
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>

                <input
                  type="text"
                  placeholder="SKU search"
                  className="input input-bordered w-full max-w-52"
                />

                <input
                  type="text"
                  placeholder="Phone, SerialId Search"
                  className="input input-bordered w-full max-w-52"
                />
                <p className="text-xl font-semibold text-success">
                  Total Order: 312
                </p>
              </div>
              {/* End Filter */}

              {/* table */}
              <div className="overflow-x-auto mt-4">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      <th className="text-sm">SERIAL ID</th>
                      <th className="text-sm">TOTAL BILL</th>
                      <th className="text-sm">PRODUCT</th>
                      <th className="text-sm">STATUS</th>
                      <th className="text-sm">COURIER</th>
                      <th className="text-sm">CREATE</th>
                      <th className="text-sm">NOTE</th>
                      <th className="text-sm">UPDATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr className="">
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      <td>
                        <p className="font-bold text-success">E-commerce</p>
                        <p>invoice: 454</p>
                        <p className="w-32">02-07-24, 10:00 AM</p>
                        <p className="font-bold mt-2">Atikur Rahman</p>
                        <p className="text-sm opacity-50"> Mirpur, Dahka </p>
                        <p className="text-sm opacity-50"> 0170000000 </p>
                        <p className="text-sm opacity-80 text-error w-28">
                          Customer Notes will show
                        </p>
                      </td>
                      <td >
                        <p className="w-44 md:w-full"> Total Bill: <span className="text-success"> 1850 TK</span></p>
                        <p className="w-44 md:w-full"> Delivery Change: <span className="text-success"> 130 TK</span> </p>
                        <p className="w-44 md:w-full"> Discount: <span className="text-success"> 100 TK</span></p>
                        <hr className="w-40 border-2 my-1" />
                        <p className="w-44 md:w-full font-bold"> Grand total: <span className="text-success"> 1930 TK</span></p>
                        <p className="w-44 md:w-full font-bold"> Advanced: <span className="text-success"> 800 TK</span></p>
                        <hr className="w-40 border-2 mt-1" />
                        <p className="font-bold text-error w-44 md:w-full">Condition: 1130 TK
                        </p>
                      </td>
                      <td>PRODUCT</td>
                      <td >
                        <select className="select select-bordered w-full max-w-24 select-sm">
                          <option disabled selected>
                            pending
                          </option>
                          <option>Han Solo</option>
                          <option>Greedo</option>
                        </select>
                      </td>
                      <td>
                        <select className="select select-bordered w-full max-w-24 select-sm">
                          <option disabled selected>
                            courier
                          </option>
                          <option>Han Solo</option>
                          <option>Greedo</option>
                        </select>
                      </td>
                      <td>Visitor</td>
                      <td>note</td>
                      <td>
                        <button className="btn btn-sm bg-[#2eb7f237] text-[#2eb7f2]">
                          Update
                        </button>
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

export default Orders
