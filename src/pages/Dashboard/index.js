import React, { useContext } from "react";
import { Container } from "reactstrap";



//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AuthContext } from "../../utils/context/AuthProvider";





const Dashboard = () => {

  document.title="Estarch | Dashboard"
  const {authUser} = useContext(AuthContext)

  console.log(authUser);

  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Minible" breadcrumbItem="Dashboard" />     
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;