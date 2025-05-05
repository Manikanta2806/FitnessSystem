import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Table, Button } from "react-bootstrap";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import bgUrl from "../src/assets/paymentpic.png";

export default function TrainerCustomerDashboard() {
  const [trainers, setTrainers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);

  const currentMonth = moment().format("MMMM");
  const currentYear = moment().year();

  const fetchAllData = async () => {
    try {
      const [trainerRes, customerRes] = await Promise.all([
        axios.get("https://fitnesssystem.onrender.com/api/admin/all"),
        axios.get("https://fitnesssystem.onrender.com/api/admin/allc"),
      ]);

      const trainerData = trainerRes.data || [];
      const customerData = customerRes.data || [];

      setTrainers(trainerData);
      setCustomers(customerData);

      const trainerUserIds = trainerData
        .map((t) => (typeof t.user_id === "object" ? t.user_id._id : t.user_id))
        .filter(Boolean);

      const customerUserIds = [
        ...trainerData
          .flatMap((t) =>
            t.customers?.map((c) =>
              typeof c.user_id === "object" ? c.user_id._id : c.user_id
            ) || []
          ),
        ...customerData.map((c) =>
          typeof c.user_id === "object" ? c.user_id._id : c.user_id
        ),
      ].filter(Boolean);

      const assignedTrainerUserIds = customerData
        .map((c) =>
          typeof c.assignedTrainer?.user_id === "object"
            ? c.assignedTrainer.user_id._id
            : c.assignedTrainer?.user_id
        )
        .filter(Boolean);

      const allUserIds = [
        ...new Set([ ...trainerUserIds, ...customerUserIds, ...assignedTrainerUserIds ]),
      ];

      const map = {};
      await Promise.all(
        allUserIds.map(async (id) => {
          try {
            const res = await axios.get(
              `https://fitnesssystem.onrender.com/api/users/getuser/${id}`
            );
            map[id] = res.data;
          } catch {
            map[id] = { username: "Unknown", email: "Unknown" };
          }
        })
      );
      setUserMap(map);
    } catch (err) {
      console.error("Error fetching:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handlePaySalary = async (trainerId) => {
    try {
      const res = await axios.post("https://fitnesssystem.onrender.com/api/admin/pay", {
        trainerId,
        month: currentMonth,
        year: currentYear,
      });
      alert(res.data.message || "Paid successfully!");
      fetchAllData();
    } catch (err) {
      alert("Payment failed.");
    }
  };

  const isSalaryPaid = (trainer) => {
    return trainer.salaryHistory?.some(
      (s) => s.month === currentMonth && String(s.year) === String(currentYear)
    );
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="container py-5 px-4"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "20px",
          color: "white",
          maxWidth: "1100px",
          width: "100%",
          boxShadow: "0 8px 32px 0 rgba(255, 215, 0, 0.3)",
        }}
      >
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3">Loading data...</p>
          </div>
        ) : (
          <>
            <h2 className="text-center mb-4 text-warning">🧑‍🏫 Trainer Details</h2>
            <div className="table-responsive">
              <Table bordered hover className="table-dark text-center">
                <thead className="table-warning text-dark">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Assigned Customers</th>
                    <th>Salary Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((trainer) => {
                    const trainerUserId =
                      typeof trainer.user_id === "object"
                        ? trainer.user_id._id
                        : trainer.user_id;

                    const trainerInfo = userMap[trainerUserId] || {};

                    const customerUsernames = (trainer.customers || [])
                      .map((customer) => {
                        const custUserId =
                          typeof customer._id === "object"
                            ? customer._id
                            : customer._id;
                        return userMap[custUserId]?.username || "Unknown";
                      })
                      .filter(Boolean);

                    return (
                      <tr key={trainer._id}>
                        <td>{trainerInfo.username || "N/A"}</td>
                        <td>{trainerInfo.email || "N/A"}</td>
                        <td>{trainer.age}</td>
                        <td>{trainer.experience}</td>
                        <td>{trainer.specialization}</td>
                        <td>
                          {customerUsernames.length > 0
                            ? customerUsernames.join(", ")
                            : "No Customers Assigned"}
                        </td>
                        <td>
                          <span
                            className={`badge px-3 py-2 ${
                              isSalaryPaid(trainer) ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {isSalaryPaid(trainer) ? "Paid" : "Not Paid"}
                          </span>
                        </td>
                        <td>
                          {!isSalaryPaid(trainer) && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handlePaySalary(trainer._id)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            <h2 className="text-center my-4 text-warning">🧍 Customer Details</h2>
            <div className="table-responsive">
              <Table bordered hover className="table-dark text-center">
                <thead className="table-warning text-dark">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Weight (kg)</th>
                    <th>Height (cm)</th>
                    <th>Assigned Trainer</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const userId =
                      typeof customer.user_id === "object"
                        ? customer.user_id._id
                        : customer.user_id;

                    const userInfo = userMap[userId] || {};

                    const assignedTrainerUserId =
                      typeof customer.assignedTrainer?.user_id === "object"
                        ? customer.assignedTrainer.user_id._id
                        : customer.assignedTrainer?.user_id;

                    const assignedTrainerInfo =
                      userMap[assignedTrainerUserId] || {};

                    return (
                      <tr key={customer._id}>
                        <td>{userInfo.username || "N/A"}</td>
                        <td>{userInfo.email || "N/A"}</td>
                        <td>{customer.age}</td>
                        <td>{customer.weight}</td>
                        <td>{customer.height}</td>
                        <td>
                          {assignedTrainerInfo.username || "Not Assigned"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
