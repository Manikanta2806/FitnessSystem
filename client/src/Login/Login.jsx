import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/registerbackground.webp";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
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
          maxWidth: "420px",
          width: "100%",
          border: "2px solid gold",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#DAA520" }}>
          Welcome Back
        </h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Email ID
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-dark fw-bold shadow-lg rounded py-2"
            style={{ backgroundColor: "#DAA520", borderColor: "gold" }}
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="fw-semibold text-dark">Don't have an account?</span>{" "}
          <Link
            to="/register"
            className="fw-bold"
            style={{ color: "#4B0082", textDecoration: "none" }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
