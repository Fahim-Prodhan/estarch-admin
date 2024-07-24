import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const Refund = () => {
  document.title = "Estarch | Add Supply"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Add Supply" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Supply
            </p>
            <div className="mt-4 mx-4">
              <form className="w-[60%]  mx-auto justify-center grid lg:grid-cols-2 gap-4">
                <label className="input input-bordered flex items-center gap-2">
                  Name
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter Name"
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  Phone
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter Phone Number"
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  Address
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter address"
                  />
                </label>

                <input
                  type="file"
                  className="file-input file-input-bordered file-input-info w-full "
                />
                <input
                  type="checkbox"
                  className="toggle toggle-accent lg:col-span-2"
                  defaultChecked
                />

                <button className="btn btn-sm btn-success text-white w-24 lg:col-span-2 place-self-center">Add</button>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Refund
