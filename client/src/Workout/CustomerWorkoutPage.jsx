// pages/CustomerWorkoutPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import backgroundImg from "../assets/registerbackground.webp"; // reusing login bg for consistency
import { useNavigate } from "react-router-dom";

const CustomerWorkoutPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
    } else {
      axios
        .get(`https://fitnesssystem.onrender.com/api/workouts/${user._id}`)
        .then((res) => setPlans(res.data))
        .catch((err) => {
          console.error("Error fetching plans:", err);
          setError("Failed to load workout plans.");
          setPlans([]);
        });
    }
  }, [user, navigate]);

  const parsePlanEntries = (raw) => {
    let text = "";

    if (typeof raw === "object" && raw !== null) {
      text = JSON.stringify(raw);
    } else if (typeof raw === "string") {
      text = raw;
    }

    text = text.trim();
    if (text.startsWith("{")) text = text.slice(1);
    if (text.endsWith("}")) text = text.slice(0, -1);

    return text
      .split(",")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const [k, v] = pair.split(":");
        const day = k?.replace(/['"\s]/g, "") || "";
        const ex = v?.replace(/['"\s]/g, "") || "";
        return [day, ex];
      })
      .filter(([day]) => day);
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start py-5"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "20px",
      }}
    >
      <div
        className="container shadow-lg p-4"
        style={{
          backgroundColor: "rgba(255, 235, 205, 0.95)",
          borderRadius: "20px",
          border: "2px solid gold",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
          maxWidth: "900px",
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#4B0082" }}>
          🏋️‍♂️ Your Workout Plans
        </h2>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {plans.length === 0 ? (
          <p className="text-center fw-semibold" style={{ color: "#DAA520" }}>
            No workout plans available.
          </p>
        ) : (
          plans.map((plan) => {
            const entries = parsePlanEntries(plan.plan);

            return (
              <div
                key={plan._id}
                className="card mb-4 shadow"
                style={{
                  borderColor: "#DAA520",
                  backgroundColor: "#fffaf0",
                }}
              >
                <div
                  className="card-header d-flex justify-content-between fw-semibold"
                  style={{ backgroundColor: "#DAA520", color: "#000" }}
                >
                  <span>
                    <i className="bi bi-calendar-date"></i> Start:{" "}
                    {new Date(plan.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    <i className="bi bi-calendar2-check"></i> End:{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="card-body">
                  {entries.length > 0 ? (
                    <table className="table table-striped table-bordered">
                      <thead className="table-warning text-center">
                        <tr>
                          <th>Day</th>
                          <th>Exercise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map(([day, exercise]) => (
                          <tr key={day}>
                            <td className="fw-bold">{day}</td>
                            <td>{exercise}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No workout data provided.</p>
                  )}

                  <p className="mt-3">
                    <strong>Status: </strong>
                    <span
                      className="badge"
                      style={{ backgroundColor: "#4B0082", color: "#fff" }}
                    >
                      {plan.status}
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerWorkoutPage;
