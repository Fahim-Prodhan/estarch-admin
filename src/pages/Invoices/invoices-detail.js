import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import Barcode from 'react-barcode';
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Import Image
import logo from "../../assets/images/logo-dark.png";
import baseUrl from "../../helpers/baseUrl";

const InvoiceDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null); // State to store order data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null);
  useEffect(() => {
    // Function to fetch order data
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/orders/order/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrder(data); // Set order data in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error.message); // Set error message if any error occurs
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchOrder(); // Call the fetch function

    // Optional cleanup function if needed
    return () => {
      // Cleanup logic
    };
  }, [id]);
  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>;
  document.title = "Invoice Detail ";



  // Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  return (
    <React.Fragment>
      <style>
        {`
          @media print {
            @page {
              size: auto;
              margin: 0;
            }
            body::before {
              content: none;
            }
            .page-content {
              padding: 0;
              margin: 0;
              box-shadow: none;
              background: none;
            }
            .card {
              box-shadow: none;
              border: none;
              background-color: transparent;
            }
            .page-title {
              display: none;
            }
          }
        `}
      </style>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Invoices" breadcrumbItem="Invoice Detail" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="invoice-title">
                    <h4 className="float-end font-size-16">
                      <Barcode
                        className='w-44'
                        value={order.invoice}
                        displayValue={true}
                        lineColor="#00000"
                      />
                      <p className="-mt-8 ml-2">{order.invoice}</p>
                    </h4>
                    <div className="mb-4">
                      <img src={logo} alt="logo" width={100} />
                    </div>
                    <div className="text-muted">
                      <p className="mb-1">19/A (Front gate of Masjid E Noor),Chowdhury Para<br /> Malibag,Dhaka-1219</p>
                      <p className="mb-1"><i className="uil uil-envelope-alt me-1"></i> estarch247@gmail.com</p>
                      <p><i className="uil uil-phone me-1"></i> +8801781813939</p>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <Row>
                    <Col sm="6">
                      <div className="text-muted">
                        <h5 className="font-size-16 mb-3">Billed To:</h5>
                        <h5 className="font-size-15 mb-2">{order.name}</h5>
                        <p className="mb-1">{order.address}</p>
                        <p>{order.phone}</p>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="text-muted text-sm-end">
                        <div>
                          <h5 className="font-size-16 mb-1">Invoice No:</h5>
                          <p>{order.invoice}</p>

                        </div>
                        <div className="mt-4">
                          <h5 className="font-size-16 mb-1">Invoice Date:</h5>
                          <p>{order.createdAt.slice(0, 10)}</p>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-size-16 mb-1">Order No:</h5>
                          <p>#{order.orderNumber}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="py-2">
                    <h5 className="font-size-15">Order summary</h5>
                    <div className="table-responsive">
                      <Table className="table-nowrap table-centered mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: "70px" }}>No.</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th className="text-end" style={{ width: "120px" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cartItems.map((item, key) => (
                            <tr key={key}>
                              <td>{key + 1}</td>
                              <td>
                                <h5 className="font-size-15 mb-1">{item.title}</h5>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">Size : <span className="fw-medium">{item.size}</span></li>
                                </ul>
                              </td>
                              <td>{item.price}</td>
                              <td>{item.quantity}</td>
                              <td className="text-end">{item.price}</td>
                            </tr>
                          ))}
                          <tr>
                            <th colSpan="4" className="text-end">Sub Total</th>
                            <td className="text-end">{order.totalAmount}</td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">
                              Discount :</th>
                            <td className="border-0 text-end">- {order.discount}</td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">
                              Shipping Charge :</th>
                            <td className="border-0 text-end">{order.deliveryCharge}</td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">
                              Tax</th>
                            <td className="border-0 text-end">00</td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">Total</th>
                            <td className="border-0 text-end"><h4 className="m-0">{order.grandTotal}</h4></td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">Advance</th>
                            <td className="border-0 text-end"><h4 className="m-0">{order.advanced}</h4></td>
                          </tr>
                          <tr>
                            <th colSpan="4" className="border-0 text-end">Due Amount</th>
                            <td className="border-0 text-end"><h4 className="m-0">{order.grandTotal - order.advanced}</h4></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="d-print-none mt-4">
                      <div className="float-end">
                        <Link to="#" onClick={printInvoice} className="btn btn-success waves-effect waves-light me-1"><i className="fa fa-print"></i></Link>{" "}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceDetail;
