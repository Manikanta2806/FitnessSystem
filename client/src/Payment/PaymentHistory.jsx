// frontend/src/pages/PaymentHistory.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import "bootstrap/dist/css/bootstrap.min.css";
import bgUrl from "../assets/paymentpic.png";

export default function PaymentHistory() {
    const { user, token } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPayments() {
            if (!user || !user._id) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://fitnesssystem.onrender.com/api/payment/history/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPayments(response.data);
            } catch (error) {
                setError(error.response?.data?.error || "Failed to load payments.");
            } finally {
                setLoading(false);
            }
        }

        fetchPayments();
    }, [user, token]);

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backdropFilter: "blur(5px)"
            }}
        >
            <div className="container py-5 px-4" style={{
                background: "rgba(0, 0, 0, 0.75)",
                borderRadius: "20px",
                color: "white",
                maxWidth: "95%",
                width: "1100px",
                boxShadow: "0 8px 32px 0 rgba(255, 215, 0, 0.3)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.18)"
            }}>
                <h2 className="text-center mb-4" style={{ color: "#FFD700", fontWeight: "bold", textShadow: "1px 1px 2px black" }}>
                    💳 Payment History
                </h2>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Fetching payment history...</p>
                    </div>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : payments.length === 0 ? (
                    <p className="text-center">No payments found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-dark table-bordered rounded text-center align-middle">
                            <thead className="table-warning text-dark">
                                <tr>
                                    {user.role === "trainer" && <th>Customer</th>}
                                    <th>Plan</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Transaction ID</th>
                                    <th>Trainer</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id}>
                                        {user.role === "trainer" && (
                                            <td>{payment.user_id?.username || "Unknown"}</td>
                                        )}
                                        <td>{payment.plan_name}</td>
                                        <td>₹{payment.amount}</td>
                                        <td>
                                            <span className={`badge px-3 py-2 ${payment.payment_status === "Success" ? "bg-success" : "bg-secondary"}`}>
                                                {payment.payment_status || "Pending"}
                                            </span>
                                        </td>
                                        <td>{payment.transaction_id}</td>
                                        <td>
                                            {payment.assigned_trainer?.user_id?.username ||
                                                payment.assigned_trainer?.username || "None"}
                                        </td>
                                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
