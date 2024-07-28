import React from "react"
import { Container } from "reactstrap"
import pro_img from '../../../assets/images/product/img-1.png'
import pro_img1 from '../../../assets/images/product/img-2.png'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const PurchaseList = () => {
  document.title = "Estarch | Purchase List"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Purchase List" />
          <div className="shadow-lg ">
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

            <div className="overflow-x-auto">
              <table className="table table-zebra ">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Serial ID</th>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>Total Bill</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>
                      <p>sri2540rzi</p>
                      <p className="text-xs opacity-55">24 May,2024 12:21 PM</p>
                    </td>
                    <td className="flex gap-1 items-center flex-wrap">
                      <img className="w-20" src={pro_img} alt="" />
                      <p className="font-bold">X</p>
                      <p>245</p>
                    </td>
                    <td>
                      <p className="font-bold text-warning">XYX</p>
                      <p className="">013030000</p>
                      <p className="text-error">ABC</p>
                    </td>
                    <td>5700 Tk</td>
                    <td><button className="text-white bg-success p-1 rounded-md">Receive</button></td>
                    <td>admin</td>
                    <td>None</td>
                    <td className="space-x-2">
                      <button className="text-blue-500 text-xl"><FaRegEye /></button>
                      <button className="text-error text-xl"><RiDeleteBin6Fill /></button>
                    </td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>
                      <p>sri2540rzi</p>
                      <p className="text-xs opacity-55">24 May,2024 12:21 PM</p>
                    </td>
                    <td className="flex flex-wrap gap-1 items-center">
                      <img className="w-20" src={pro_img1} alt="" />
                      <p className="font-bold">X</p>
                      <p>245</p>
                    </td>
                    <td>
                      <p className="font-bold text-warning">XYX</p>
                      <p className="">013030000</p>
                      <p className="text-error">ABC</p>
                    </td>
                    <td>5700 Tk</td>
                    <td><button className="text-white bg-success p-1 rounded-md">Receive</button></td>
                    <td>admin</td>
                    <td>None</td>
                    <td className="space-x-2">
                      <button className="text-blue-500 text-xl"><FaRegEye /></button>
                      <button className="text-error text-xl"><RiDeleteBin6Fill /></button>
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

export default PurchaseList
