import React from "react";
import { Container } from "reactstrap";



//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";





const PosOrders = () => {

  document.title="Estarch | Pos Orders"


  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Minible" breadcrumbItem="Pos Orders" />
          <div>
            {/* Code Here */}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PosOrders;