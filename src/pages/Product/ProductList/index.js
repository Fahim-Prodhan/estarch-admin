// Refund.js
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { MDBDataTable } from "mdbreact";
import { MdDeleteSweep } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import baseUrl from "../../../helpers/baseUrl";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import ProductDetailsModal from "./ProductDetailsModal"; // Import the modal component
import "./productDetails.css"; // Import the CSS file
import BarcodePrintModal from "./BarcodePrintModal";
// import 'bootstrap/dist/css/bootstrap.min.css';


const Refund = () => {
  document.title = "Estarch | Product List";

  const [data, setData] = useState({ columns: [], rows: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleBarcodeModal = () => {
    setIsBarcodeModalOpen(!isBarcodeModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetch(`${baseUrl}/api/products/products`)
      .then(response => response.json())
      .then(data => {
        const formattedData = {
          columns: [
            { label: "Image", field: "image", sort: "asc", width: 150 },
            { label: "Product Info", field: "p_info", sort: "asc", width: 150 },
            { label: "SKU", field: "sku", sort: "asc", width: 200 },
            { label: "Barcode", field: "barcode", sort: "asc", width: 150 },
            { label: "Others info", field: "others_info", sort: "asc", width: 300 },
            { label: "Action", field: "action", width: 100 },
          ],
          rows: data.map((item, index) => ({
            image: (
              <div className="w-12 flex justify-center">
                <div className="flex justify-center">
                  <img className="" src={item.images[0]} alt={item.name} />
                </div>
              </div>
            ),
            p_info: (
              <div>
                <p><span className="font-bold">Name:</span> <span>{item.productName}</span></p>
                <p><span className="font-bold">Type:</span> <span>{item.selectedType}</span></p>
                <p><span className="font-bold">Category:</span> <span>{item.selectedCategoryName}</span></p>
                <p><span className="font-bold">SubCategory:</span> <span>{item.selectedSubCategory}</span></p>
                <p><span className="font-bold">Brand:</span> <span>{item.selectedBrand}</span></p>
              </div>
            ),
            sku: <p><span className="font-bold">Sku:</span> <span>EST001</span></p>,
            barcode: (
              <div className="space-y-2">
                {
                  item.sizeDetails.map(s =>
                    <p className="flex items-center gap-2"><span className="bg-base-300 px-2 rounded-md">{s.size}</span><FaArrowRightLong /><span className="text-success">{s.barcode}</span></p>
                  )
                }
              </div>
            ),
            others_info: (
              <div className="space-y-2 ">
                <div className="flex flex-wrap gap-2">
                  <p className={`bg-${item.productStatus === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                    Status
                  </p>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked={item.productStatus === true ? true : false} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className={`bg-${item.posSuggestion === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                    Pos Suggestion
                  </p>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked={item.posSuggestion === true ? true : false} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className={`bg-${item.showSize === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                    Show Size
                  </p>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked={item.showSize === true ? true : false} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className={`bg-${item.featureProduct === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                    Feature
                  </p>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked={item.featureProduct === true ? true : false} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className={`bg-${item.freeDelevary === true ? "blue" : "red"}-500 text-center text-white p-1 rounded-md w-12`}>
                    Free Delivery.
                  </p>
                  <input type="checkbox" className="toggle toggle-info" defaultChecked={item.freeDelevary === true ? true : false} />
                </div>
              </div>
            ),
            action: (
              <div className="dropdown flex justify-center">
                <div tabIndex={0} role="button" className="btn m-1 btn-sm"><BsThreeDotsVertical /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1]  p-2 shadow space-y-2">
                  <li>
                    <button
                      className="btn btn-sm btn-accent text-white"
                      onClick={() => {
                        setSelectedProduct(item);
                        toggleModal();
                      }}
                    >
                      Details
                    </button>
                  </li>
                  <li><a className="btn btn-sm text-success text-xl"><FaEdit /></a></li>
                  <li><a className="btn btn-sm text-error text-xl"><MdDeleteSweep /></a></li>
                  <li><button onClick={() => {
                    setSelectedProduct(item);
                    toggleBarcodeModal();
                  }} className="btn btn-sm text-white btn-primary">Print</button></li>
                </ul>
              </div>
            ),
          })),
        };
        setData(formattedData);
      });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Product List" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Product List
            </p>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <MDBDataTable responsive bordered data={data} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <ProductDetailsModal isOpen={isModalOpen} toggle={toggleModal} product={selectedProduct} />
      <BarcodePrintModal isOpen={isBarcodeModalOpen} toggle={toggleBarcodeModal} product={selectedProduct} />
    </React.Fragment>
  );
};

export default Refund;
