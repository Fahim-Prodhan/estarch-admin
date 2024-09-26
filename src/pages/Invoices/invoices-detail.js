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
  }, [id]);

  useEffect(() => {
    if (order) {
      // window.print();
    }
  }, [order]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>;

  document.title = "Invoice Detail";

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

          .text-black * {
            color: black !important;
            font-weight: 700;
          }
        `}
      </style>
      <div className="page-content text-black">
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
                        className="w-44"
                        value={order.invoice}
                        displayValue={false}
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
                            <th>Regular Price</th>
                            <th>Discount</th>
                            <th>Selling Price</th>
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
                                <h5 className="font-size-15 mb-1">{item.SKU}</h5>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">Size : {item.barcode} <span className="fw-medium">({item.size})</span></li>
                                </ul>
                              </td>
                              <td>{item.price + item.discountAmount}</td>
                              <td>{item.discountAmount}</td>
                              <td>{item.price}</td>
                              <td>{item.quantity}</td>
                              <td className="text-end">{(item.price) * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div className="flex">
                        <div className={order?.exchangeDetails?.items ? "w-1/2  mt-20 " : "hidden"}>
                          {
                            order.exchangeAmount ? <div className=' flex justify-between border-b'>
                              <p className=" font-bold">Exchange (Back)</p>
                              <p className=" ">{order.exchangeDetails.invoiceNo}</p>
                            </div> : null
                          }
                          {
                            order.exchangeAmount ? <table className="w-full mb-4 text-left text-xs border-collapse">
                              <thead>
                                <tr>
                                  <th className="border-b py-1">Description</th>
                                  <th className="border-b py-1">Qty</th>
                                  <th className="border-b py-1">MRP</th>
                                  <th className="border-b py-1">Dis</th>
                                  <th className="border-b py-1">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.exchangeDetails?.items?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="py-1 font-bold">
                                      {item.SKU} - {item.barcode} ({item.size})
                                    </td>
                                    <td className="py-1 font-bold">{item.quantity}</td>
                                    <td className="py-1 font-bold">{(item.price + item.discountAmount)}</td>
                                    <td className="py-1 font-bold">{item.discountAmount}</td>
                                    <td className="py-1 font-bold">{item.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table> : null
                          }
                        </div>
                        <div className={order?.exchangeDetails?.items ? "w-1/2" : "w-full"}><div className="flex justify-between border-t py-2  border-b">
                          <div className="w-2/3 text-end">Sub Total</div>
                          <div className="w-1/3 text-end">{order.totalAmount + order.discount}</div>
                        </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Discount :</div>
                            <div className="w-1/3 text-end">- {order.discount + order.adminDiscount}</div>
                          </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Shipping Charge :</div>
                            <div className="w-1/3 text-end">{order.deliveryCharge}</div>
                          </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Tax</div>
                            <div className="w-1/3 text-end">00</div>
                          </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Total</div>
                            <div className="w-1/3 text-end">
                              <h4 className="m-0">{order.grandTotal}</h4>
                            </div>
                          </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Advance</div>
                            <div className="w-1/3 text-end">
                              <h4 className="m-0">{order.advanced}</h4>
                            </div>
                          </div>

                          <div className="flex justify-between py-2 border-b">
                            <div className="w-2/3 text-end">Due Amount</div>
                            <div className="w-1/3 text-end">
                              <h4 className="m-0">{order.grandTotal - order.advanced}</h4>
                            </div>
                          </div></div>
                      </div>

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
