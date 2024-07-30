import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const AttributeValue = () => {
  document.title = "Estarch | Attribute Value"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Attribute Value" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Attribute Value
            </p>
            <div className="lg:w-[30%] mt-4 mx-4">
              <form className=" space-y-4">
                <select className="select select-bordered w-full ">
                  <option disabled selected>
                   Select Attribute
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
                <div>
                  <label className="label p-0">
                    <span className="label-text">Attribute Value Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Attribute Value Name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <button className="btn btn-sm btn-success text text-white">Add Value</button>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AttributeValue
