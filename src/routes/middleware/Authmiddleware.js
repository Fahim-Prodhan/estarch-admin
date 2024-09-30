import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../utils/context/AuthProvider";

const Authmiddleware = (props) => {
  const { authUser,loadingUser } = useContext(AuthContext);

  if (loadingUser) {
    return (
        <div className="flex justify-center">
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
        </div>
    );
}

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (authUser.role !== 'admin' && authUser.role !== 'accountant' && authUser.role !== 'investor' ) {
    return <Navigate to="/login" />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;
