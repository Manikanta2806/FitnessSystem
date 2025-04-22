import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import backgroundImage from "../assets/registerbackground.webp";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday",
];

const mealTimes = ["morning", "afternoon", "evening", "night"];

const DietPlanView = () => {
  const { userId, role } = useContext(AuthContext);
  const [dietPlan, setDietPlan] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDietPlan = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:4000/api/diet/customer/${userId}`);
        if (res.data && res.data.weekPlan) {
          setDietPlan(res.data);
          setMessage("");
        } else {
          setMessage("⚠️ No diet plan found.");
        }
      } catch (err) {
        console.error("❌ Error fetching diet plan:", err);
        setMessage("❌ Failed to load diet plan.");
      }
    };

    fetchDietPlan();
  }, [userId, role]);

  return (
    <div
      className="d-flex justify-content-center align-items-center p-4"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage}) center/cover no-repeat`,
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow-lg w-100"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          maxWidth: "1200px",
          overflowX: "auto",
        }}
      >
        <div className="card-body p-4">
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#DAA520" }}>
            Your Weekly Diet Plan
          </h2>

          {message && (
            <div className="alert alert-warning text-center fw-semibold">
              {message}
            </div>
          )}

          {dietPlan && dietPlan.weekPlan && (
            <>
              <div className="mb-3 text-center fs-5 fw-semibold">
                <span className="text-dark">Weight:</span>{" "}
                <span className="text-success">{dietPlan.weight} kg</span>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead className="table-warning">
                    <tr>
                      <th>Day</th>
                      {mealTimes.map((time) => (
                        <th key={time} className="text-capitalize">
                          {time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map((day) => {
                      const meals = dietPlan.weekPlan[day];
                      return (
                        <tr key={day}>
                          <td className="fw-bold text-primary">{day}</td>
                          {mealTimes.map((time) => (
                            <td key={time}>
                              {meals?.[time] || (
                                <span className="text-muted">No data</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanView;
