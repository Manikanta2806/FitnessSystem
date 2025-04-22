import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import backgroundImage from "../assets/paymentpic.png"; // same background as login

const PaymentForm = () => {
  const [membershipType, setMembershipType] = useState("standard");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, token, userId } = useContext(AuthContext);

  const plans = {
    standard: {
      "1-month": 800,
      "3-month": 2000,
      "6-month": 3500,
    },
    trainer_assisted: {
      "1-month": 1200,
      "3-month": 3000,
      "6-month": 5000,
    },
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/trainers/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setTrainers([]);
      }
    };

    if (token) fetchTrainers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const [planName, amount] = selectedPlan.split(":");

    if (!planName || !amount) {
      setMessage("❗ Please select a valid plan.");
      setSubmitting(false);
      return;
    }

    if (!transactionId.trim()) {
      setMessage("❗ Please enter the transaction ID.");
      setSubmitting(false);
      return;
    }

    if (membershipType === "trainer_assisted" && !selectedTrainer) {
      setMessage("❗ Please select a trainer.");
      setSubmitting(false);
      return;
    }

    if (!userId) {
      setMessage("⚠️ User not found. Please re-login.");
      setSubmitting(false);
      return;
    }

    try {
      const paymentPayload = {
        plan_name: planName,
        amount: parseInt(amount),
        membership_type: membershipType,
        transaction_id: transactionId,
        ...(membershipType === "trainer_assisted" && {
          assigned_trainer: selectedTrainer,
        }),
      };

      await axios.post("http://localhost:4000/api/payment/pay", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (membershipType === "trainer_assisted" && selectedTrainer) {
        const assignPayload = {
          trainerId: selectedTrainer,
          customerId: userId,
          membershipPlan: planName,
        };

        await axios.post("http://localhost:4000/api/trainers/custassign", assignPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMessage("✅ Payment successful and trainer assigned!");
      setSelectedPlan("");
      setSelectedTrainer("");
      setTransactionId("");
    } catch (error) {
      console.error("Payment/Assignment error:", error?.response?.data || error.message);
      setMessage(
        error?.response?.data?.error || "❌ Payment or assignment failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        minHeight: "100vh",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          background: "rgba(255, 235, 205, 0.95)",
          borderRadius: "15px",
          maxWidth: "520px",
          width: "100%",
          border: "2px solid gold",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#DAA520" }}>
          Membership Payment
        </h2>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Membership Type
            </label>
            <select
              className="form-select"
              value={membershipType}
              onChange={(e) => {
                setMembershipType(e.target.value);
                setSelectedPlan("");
                setSelectedTrainer("");
              }}
            >
              <option value="standard">Standard (No Trainer)</option>
              <option value="trainer_assisted">Premium (Trainer Assisted)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Plan Duration
            </label>
            <select
              className="form-select"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">-- Select a Plan --</option>
              {Object.entries(plans[membershipType]).map(([duration, price]) => (
                <option key={duration} value={`${duration}:${price}`}>
                  {duration} - ₹{price}
                </option>
              ))}
            </select>
          </div>

          {membershipType === "trainer_assisted" && (
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                Assign Trainer
              </label>
              <select
                className="form-select"
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <option value="">-- Choose Trainer --</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.user_id?.username
                      ? `${trainer.user_id.username} (${trainer.user_id.email})`
                      : trainer.user_id?.email || "Unnamed Trainer"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Transaction ID
            </label>
            <input
              type="text"
              className="form-control"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter UPI / Bank Transaction ID"
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-dark fw-bold shadow-lg rounded py-2"
            style={{ backgroundColor: "#DAA520", borderColor: "gold" }}
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Submit Payment"}
          </button>
        </form>

        {selectedPlan && (
          <div className="mt-3 alert alert-secondary text-center">
            <strong>Selected Plan:</strong>{" "}
            {selectedPlan.replace(":", " - ₹")} ({membershipType})
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
