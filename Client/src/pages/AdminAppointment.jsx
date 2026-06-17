import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get(
        `${API}/api/admin/getallAppointmentsAdmin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setAllAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <h2 className="p-3 text-center">
        All Appointments for Admin Panel
      </h2>

      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allAppointments.length > 0 ? (
              allAppointments.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.userInfo?.fullName}</td>
                  <td>{item.doctorInfo?.fullName}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <Alert variant="info">
                    No Appointments Found
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminAppointments;