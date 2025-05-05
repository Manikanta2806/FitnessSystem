import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrainerHistory.css"; // Optional external CSS for any overrides
import bgUrl from "../assets/paymentpic.png"

const TrainerHistory = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      const token = localStorage.getItem("token");
      const trainerId = localStorage.getItem("userId");

      if (!token || !trainerId) {
        setMessage("Missing authentication or trainer ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`https://fitnesssystem.onrender.com/api/payment/trainer/history/${trainerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSalaryHistory(res.data.salaryHistory || []);
        setMessage(res.data.message || "Salary history fetched.");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setMessage("Trainer not found or no salary records.");
        } else {
          setMessage("Failed to fetch salary history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryHistory();
  }, []);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "50px 15px",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            <div className="card shadow-lg bg-white bg-opacity-75 p-4 rounded">
              <h2 className="text-center mb-4 text-primary fw-bold">Trainer Salary History</h2>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mt-2">Loading...</p>
                </div>
              ) : salaryHistory.length === 0 ? (
                <div className="alert alert-info text-center">{message}</div>
              ) : (
                <>
                  <div className="alert alert-success text-center">{message}</div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                      <thead className="table-dark text-center">
                        <tr>
                          <th>Month</th>
                          <th>Amount (₹)</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {salaryHistory.map((record, index) => (
                          <tr key={index}>
                            <td>{record.month}</td>
                            <td>₹{record.amount}</td>
                            <td>
                              <span
                                className={`badge px-3 py-2 fs-6 ${
                                  record.status === "Paid"
                                    ? "bg-success"
                                    : record.status === "Pending"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHistory;
