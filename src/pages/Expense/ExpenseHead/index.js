import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FaEdit, FaRegEye } from "react-icons/fa"
import { MdDeleteSweep } from "react-icons/md"
import { MDBDataTable } from "mdbreact"
import baseUrl from "../../../helpers/baseUrl"

const ExpenseHead = () => {
  document.title = "Estarch | Expense Head"
  const [name, setName] = useState(" ")
  const [updateId, setUpdateId] = useState(" ")
  const [refresh, setRefresh] = useState(false)
  const [update, setUpdate] = useState(false)
  const [data, setData] = useState({ columns: [], rows: [] })

  const handleEdit = async data => {
    setUpdate(true)
    setName(data.name)
    setUpdateId(data._id)

  }
  const handleDelete = async rowId => {
    try {
      const response = await fetch(`${baseUrl}/api/expense-heads/expense-heads/${rowId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRefresh(!refresh)
        alert('Expense head deleted successfully');
      } else {
        alert('Error deleting expense head');
      }
    } catch (error) {
      console.error('Error deleting expense head:', error);
      alert('Error deleting expense head');
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/expense-heads/expense-heads/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setName(' ');
      setRefresh(!refresh)
      alert('New Expense Head Is updated')
    } catch (error) {
      console.log(error);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/expense-heads/expense-heads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setName(' ');
      setRefresh(!refresh)
      alert('New Expense Head Is Created')
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    fetch(`${baseUrl}/api/expense-heads/expense-heads`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const formattedData = {
          columns: [
            { label: "Serial", field: "serial", sort: "asc", width: 150 },
            {
              label: "Name",
              field: "name",
              sort: "asc",
              width: 150,
            },
            {
              label: "Action",
              field: "action",
              sort: "asc",
              width: 100,
              default: "",
            },
          ],
          rows: data.data.map((item, index) => ({
            serial: <p>{index + 1}</p>,
            image: (
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={item.image} alt={item.name} />
                </div>
              </div>
            ),
            name: <p>{item.name}</p>,
            action: (
              <div className="flex gap-2">
                <button
                  className="text-2xl text-success"
                  onClick={() => handleEdit(item)}
                >
                  <FaEdit />
                </button>

                <button
                  className="text-2xl text-error"
                  onClick={() => handleDelete(item._id)}
                >
                  <MdDeleteSweep />
                </button>
              </div>
            ),
          })),
        }

        setData(formattedData)
      })
  }, [refresh])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Estarch" breadcrumbItem="Expense Head" />
          <div className="">
            <p className="w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              Add Expense Head
            </p>
            <div className="w-[30%] mt-4 ml-4">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Enter Expense Head Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {
                  update ? <span onClick={handleUpdate} className="btn btn-sm btn-accent text-white">Update</span> : <span onClick={handleSubmit} className="btn btn-sm btn-accent text-white">Add</span>
                }

              </label>
            </div>
            <p className="mt-12 w-full bg-gray-600 text-white p-2 font-bold text-2xl">
              List Of Expense Head
            </p>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <CardBody>
                      <MDBDataTable responsive bordered data={data} />
                    </CardBody>
                  </CardBody>
                </Card>
              </Col>
            </Row>

          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ExpenseHead
