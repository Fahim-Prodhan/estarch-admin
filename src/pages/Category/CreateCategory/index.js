import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const Refund = () => {
  document.title = "Estarch | Create Category"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Category" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Category
            </p>

            <div className="mt-4 mx-4">
              <form className="w-[60%]  mx-auto justify-center grid lg:grid-cols-2 gap-4 items-center">
                <select className="select select-bordered w-full">
                  <option disabled selected>
                    Select Parent Category
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>

                <label className="input input-bordered flex items-center gap-2">
                   Name
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter Category Name"
                  />
                </label>

                <input
                  type="file"
                  className="file-input file-input-bordered file-input-info w-full "
                />
                <input
                  type="checkbox"
                  className="toggle toggle-accent"
                  defaultChecked
                />

                <button className="btn btn-sm btn-success text-white w-32 lg:col-span-2 place-self-center">
                  Add Category
                </button>
              </form>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Refund
