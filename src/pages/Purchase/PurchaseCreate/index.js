import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const CreatePurchase = () => {
  document.title = "Estarch | create purchase"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Create Purchase" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Purchase Details
            </p>
            <form className="grid grid-cols-3 mt-4 mx-4">
              <select className="select select-bordered w-full max-w-xs">
                <option disabled selected>
                  Select
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>

              <input type="file" className="file-input file-input-bordered file-input-info w-full max-w-xs" />
              <textarea className="textarea textarea-bordered" rows={1} placeholder="Note"></textarea>
              <div className="col-span-3 text-center mt-4">
                <button className="btn btn-sm btn-success text-white">Add Purchase</button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreatePurchase
