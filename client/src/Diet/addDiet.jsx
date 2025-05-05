import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import backgroundImage from "../assets/gym_background.webp"; // 🎯 Replace with your own image

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTimes = ['morning', 'afternoon', 'evening', 'night'];

const AddDietPlan = () => {
  const { userId } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [formData, setFormData] = useState({
    customer_id: '',
    trainer_id: userId || '',
    weight: '',
    weekPlan: {},
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData((prev) => ({ ...prev, trainer_id: userId || '' }));
  }, [userId]);

  useEffect(() => {
    const fetchCustomersAndUsers = async () => {
      if (!userId) return;
      try {
        const { data: customerList } = await axios.get(
          `https://fitnesssystem.onrender.com/api/workouts/trainer-with-customers/${userId}`
        );
        setCustomers(customerList || []);

        const map = {};
        await Promise.all(
          (customerList || []).map(async (customer) => {
            const custUserId =
              typeof customer._id === "object" ? customer._id._id : customer._id;
            try {
              const { data: user } = await axios.get(
                `https://fitnesssystem.onrender.com/api/users/getuser/${custUserId}`
              );
              map[custUserId] = user;
            } catch {
              map[custUserId] = { username: "Unknown", email: "Unknown" };
            }
          })
        );
        setUserMap(map);
      } catch (err) {
        console.error("Error fetching customers or users:", err);
      }
    };

    fetchCustomersAndUsers();
  }, [userId]);

  const handleMealChange = (day, time, value) => {
    setFormData((prev) => ({
      ...prev,
      weekPlan: {
        ...prev.weekPlan,
        [day]: {
          ...(prev.weekPlan[day] || {}),
          [time]: value,
        },
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://fitnesssystem.onrender.com/api/diet/add", formData);
      setMessage("✅ Diet plan created successfully!");
      setFormData({
        customer_id: '',
        trainer_id: userId || '',
        weight: '',
        weekPlan: {},
      });
    } catch (error) {
      console.error("Error creating diet plan:", error);
      setMessage("❌ Failed to create diet plan.");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        minHeight: "100vh",
      }}
    >
      <div
        className="card p-4 shadow-lg w-100"
        style={{
          maxWidth: "850px",
          background: "rgba(255, 248, 220, 0.95)",
          borderRadius: "15px",
          border: "2px solid gold",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
        }}
      >
        <h2 className="mb-4 text-center fw-bold" style={{ color: "#DAA520" }}>
          Add Weekly Diet Plan
        </h2>

        {message && (
          <div className="alert alert-info text-center fw-semibold">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Customer Select */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Select Customer
            </label>
            <select
              name="customer_id"
              className="form-select"
              value={formData.customer_id}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => {
                const custUserId =
                  typeof customer._id === "object" ? customer._id._id : customer._id;
                const customerName = userMap[custUserId]?.username || "Unnamed Customer";
                return (
                  <option key={customer._id} value={customer._id}>
                    {customerName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Weight Input */}
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Customer Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              className="form-control"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Weekly Plan */}
          <hr />
          <h5 className="mb-3 fw-bold" style={{ color: "#DAA520" }}>Weekly Meal Plan</h5>

          {daysOfWeek.map((day) => (
            <div key={day} className="mb-4">
              <h6 className="fw-bold text-dark">{day}</h6>
              <div className="row">
                {mealTimes.map((time) => (
                  <div className="col-md-6 mb-3" key={time}>
                    <label className="form-label text-muted fw-semibold">
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.weekPlan[day]?.[time] || ''}
                      onChange={(e) => handleMealChange(day, time, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="btn text-dark fw-bold shadow px-4 py-2"
              style={{ backgroundColor: "#DAA520", borderColor: "gold" }}
            >
              ➕ Submit Diet Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDietPlan;
