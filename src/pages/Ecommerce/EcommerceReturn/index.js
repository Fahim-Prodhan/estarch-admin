import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

const Refund = () => {
  document.title = "Estarch | Return & Refund"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Return & Refund" />
          <div className="shadow-lg pb-4">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Return & Refund
            </p>
            <div className="w-[30%] mt-4 ml-4">
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="search order by serial Id" />
                <span className="btn btn-sm btn-accent text-white">Search</span>
              </label>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Refund
