import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import "./TrainerCustomerWorkoutViewPage.css";

const TrainerCustomerWorkoutViewPage = () => {
  const { userId } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [plans, setPlans] = useState([]);
  const [editedPlans, setEditedPlans] = useState({});
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomersAndUsers = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:4000/api/workouts/trainer-with-customers/${userId}`);
        const customerList = res.data || [];
        setCustomers(customerList);

        const tempMap = {};
        await Promise.all(
          customerList.map(async (customer) => {
            const custUserId = typeof customer._id === "object" ? customer._id._id : customer._id;
            try {
              const userRes = await axios.get(`http://localhost:4000/api/users/getuser/${custUserId}`);
              tempMap[custUserId] = userRes.data;
            } catch {
              tempMap[custUserId] = { username: "Unknown", email: "Unknown" };
            }
          })
        );
        setUserMap(tempMap);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
    };

    fetchCustomersAndUsers();
  }, [userId]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchPlans(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const fetchPlans = async (customerUserId) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`http://localhost:4000/api/workouts/${customerUserId}`);
      setPlans(data);

      const initialEdited = {};
      data.forEach(plan => {
        initialEdited[plan._id] = plan.plan;
      });
      setEditedPlans(initialEdited);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Could not fetch workout plans.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (planId, newValue) => {
    setEditedPlans((prev) => ({
      ...prev,
      [planId]: newValue,
    }));
  };

  const handleUpdate = async (planId) => {
    try {
      const updatedPlan = editedPlans[planId];
      await axios.put(`http://localhost:4000/api/workouts/update/${planId}`, {
        plan: updatedPlan,
      });
      alert("Workout plan updated!");
      setEditingPlanId(null);
      fetchPlans(selectedCustomerId);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const parsePlan = (plan) => {
    try {
      const entries = plan.split(",").map((line) => line.trim());
      return entries.map((entry, index) => <li key={index}>{entry}</li>);
    } catch {
      return <li>{plan}</li>;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card-style mx-auto bg-dark text-light p-4 rounded shadow" style={{ maxWidth: "1000px" }}>
        <h2 className="text-center mb-4 text-warning fw-bold">
          🏋️ Trainer - Manage Customer Workout Plans
        </h2>

        <div className="mb-4">
          <label className="form-label fw-semibold">Select a Customer</label>
          <select
            className="form-select"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((customer) => {
              const custUserId = typeof customer._id === "object" ? customer._id._id : customer._id;
              const username = userMap[custUserId]?.username || "Unnamed";
              return (
                <option key={custUserId} value={custUserId}>
                  {username}
                </option>
              );
            })}
          </select>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2">Loading workout plans...</p>
          </div>
        ) : plans.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover bg-warning text-dark">
              <thead className="table-dark text-light">
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Workout Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody >
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td>{new Date(plan.startDate).toLocaleDateString()}</td>
                    <td>{new Date(plan.endDate).toLocaleDateString()}</td>
                    <td>
                      {editingPlanId === plan._id ? (
                        <textarea
                          className="form-control"
                          rows="5"
                          value={editedPlans[plan._id]}
                          onChange={(e) => handlePlanChange(plan._id, e.target.value)}
                        />
                      ) : (
                        <ul className="mb-0 ps-3">{parsePlan(plan.plan)}</ul>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">{plan.status}</span>
                    </td>
                    <td>
                      {editingPlanId === plan._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(plan._id)}
                          >
                            💾 Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingPlanId(null)}
                          >
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => setEditingPlanId(plan._id)}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          selectedCustomerId && (
            <p className="text-muted text-center">No workout plans found for this customer.</p>
          )
        )}
      </div>
    </div>
  );
};

export default TrainerCustomerWorkoutViewPage;
