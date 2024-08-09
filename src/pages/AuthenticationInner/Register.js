import PropTypes from "prop-types";
import React, { useState } from "react";
import { Row, Col, CardBody, Card, Container, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import axios from 'axios';
import logo from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
// Import Bootstrap CSS

import baseUrl from "../../helpers/baseUrl";

const Register = (props) => {
  document.title = "Estarch | Register";

  // State to handle form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
  });

  // State to handle errors
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`${baseUrl}/api/auth/register-admin`, formData);
      console.log('Form data submitted:', response.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Error during registration:', err);
    }
  };

  return (
    <React.Fragment>
      <div className="account-page mt-8 pt-sm-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <a href="/" className="mb-5 d-block auth-logo">
                  {/* <img src={logo} alt="" height="22" className="logo logo-dark w-72 mx-auto " /> */}
                  {/* <img src={logolight} alt="" height="22" className="logo logo-light w-72 mx-auto" /> */}
                </a>
              </div>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Register Account</h5>
                    <p className="text-muted">Register new admin account now.</p>
                  </div>
                  <div className="p-2 mt-4">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      {/* Full Name Field */}
                      <div className="mb-3">
                        <Label className="form-label">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          placeholder="Enter full name"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email Field */}
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone Number Field (replaced Username) */}
                      <div className="mb-3">
                        <Label className="form-label">Phone Number</Label>
                        <Input
                          id="mobile"
                          name="mobile"
                          className="form-control"
                          placeholder="Enter phone number"
                          type="text"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          className="form-control"
                          placeholder="Enter password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Display error message if there's an error */}
                      {error && <div className="text-danger">{error}</div>}

                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-primary w-sm waves-effect waves-light"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-muted mb-0">
                          Already have an account?{" "}
                          <Link to="/login" className="fw-medium text-primary">
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Estarch.{" "}
                  <i className="mdi mdi-heart text-danger"></i> developed by Web Waiver
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func,
  registrationError: PropTypes.any,
  user: PropTypes.any,
};

export default withRouter(Register);
