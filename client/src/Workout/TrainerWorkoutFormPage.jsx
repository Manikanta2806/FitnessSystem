import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import bgl from "../assets/paymentform.png";

const TrainerWorkoutFormPage = () => {
  const { userId } = useContext(AuthContext);
  const trainerUserId = userId;

  const [customers, setCustomers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [formData, setFormData] = useState({
    customer_id: "",
    trainer_id: trainerUserId || "",
    plan: "",
    startDate: "",
    endDate: "",
  });

  // ensure trainer_id stays in sync
  useEffect(() => {
    setFormData((prev) => ({ ...prev, trainer_id: trainerUserId || "" }));
  }, [trainerUserId]);

  // fetch customers under this trainer
  useEffect(() => {
    const fetchCustomersWithUserDetails = async () => {
      if (!trainerUserId) return;
      try {
        const { data: customerList } = await axios.get(
          `http://localhost:4000/api/workouts/trainer-with-customers/${trainerUserId}`
        );
        setCustomers(customerList || []);

        // build a map of user details
        const userMapTemp = {};
        await Promise.all(
          (customerList || []).map(async (c) => {
            const custUserId = typeof c._id === "object" ? c._id._id : c._id;
            try {
              const { data: user } = await axios.get(
                `http://localhost:4000/api/users/getuser/${custUserId}`
              );
              userMapTemp[custUserId] = user;
            } catch {
              userMapTemp[custUserId] = { username: "Unknown", email: "Unknown" };
            }
          })
        );
        setUserMap(userMapTemp);
      } catch (err) {
        console.error("Failed to fetch customers or user info:", err);
      }
    };
    fetchCustomersWithUserDetails();
  }, [trainerUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/workouts/add", formData);
      alert("Workout Plan Added!");
      setFormData({
        customer_id: "",
        trainer_id: trainerUserId,
        plan: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Error adding workout plan:", err);
      alert("Error adding plan");
    }
  };

  return (
    <div
      className="trainer-bg d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "40px",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          backgroundColor: "rgba(255, 248, 220, 0.7)",   // more transparent
          backdropFilter: "blur(5px)",                  // frosted‑glass effect
          borderRadius: "15px",
          maxWidth: "700px",
          width: "100%",
          padding: "30px",
        }}
      >
        <h3 className="text-center text-dark mb-4">
          📝 Create Weekly Workout Plan
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Customer dropdown */}
          <div className="mb-3">
            <label htmlFor="customerSelect" className="form-label fw-semibold">
              Select Customer
            </label>
            <select
              id="customerSelect"
              name="customer_id"
              className="form-select"
              value={formData.customer_id}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => {
                const custUserId =
                  typeof customer._id === "object"
                    ? customer._id._id
                    : customer._id;
                const customerName =
                  userMap[custUserId]?.username || "Unnamed Customer";
                return (
                  <option key={customer._id} value={customer._id}>
                    {customerName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Workout Plan Input */}
          <div className="mb-3">
            <label htmlFor="planInput" className="form-label fw-semibold">
              Workout Plan (JSON)
            </label>
            <textarea
              id="planInput"
              name="plan"
              rows="5"
              className="form-control"
              placeholder='e.g., {"Monday": "Chest", "Tuesday": "Back"}'
              value={formData.plan}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Date Pickers */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label fw-semibold">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label fw-semibold">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-warning px-4 py-2 fw-bold"
            >
              ➕ Submit Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerWorkoutFormPage;
