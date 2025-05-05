import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/registerbackground.webp";
import defaultProfile from "../assets/defaultProfile.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    role: "customer",
    experience: "",
    age: "",
    weight: "",
    height: "",
    body_type: "",
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState(defaultProfile);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      if (file) setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      username,
      email,
      password,
      mobile,
      role,
      experience,
      age,
      weight,
      height,
      body_type,
      profilePicture,
    } = formData;

    // Basic validation
    if (!username || !email || !password || !mobile) {
      return setError("All required fields must be filled.");
    }

    if (!/^\d{10}$/.test(mobile)) {
      return setError("Mobile number must be a valid 10-digit number.");
    }

    if (role === "trainer" && (!experience || !age)) {
      return setError("Trainer fields: experience and age are required.");
    }

    if (role === "customer" && (!weight || !height || !body_type)) {
      return setError("Customer fields: weight, height, and body type are required.");
    }

    try {
      const formPayload = new FormData();
      formPayload.append("username", username);
      formPayload.append("email", email);
      formPayload.append("password", password);
      formPayload.append("mobile", mobile);
      formPayload.append("role", role);
      if (profilePicture) formPayload.append("profilePicture", profilePicture);

      if (role === "trainer") {
        formPayload.append("experience", experience);
        formPayload.append("age", age);
      } else {
        formPayload.append("weight", weight);
        formPayload.append("height", height);
        formPayload.append("body_type", body_type);
      }

      await axios.post("https://fitnesssystem.onrender.com/api/users/register", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "100px",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card p-4 shadow-lg"
              style={{
                background: "rgba(255, 235, 205, 0.95)",
                borderRadius: "15px",
                border: "2px solid gold",
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
              }}
            >
              <h2 className="text-center mb-4 fw-bold" style={{ color: "#DAA520" }}>
                Create Your Account
              </h2>

              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="text-center mb-3">
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="rounded-circle"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "2px solid #DAA520",
                      marginBottom: "10px",
                    }}
                  />
                  <input
                    type="file"
                    className="form-control"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>

                {/* Common Fields */}
                {[
                  ["Username", "username", "text"],
                  ["Email", "email", "email"],
                  ["Password", "password", "password"],
                  ["Mobile", "mobile", "text"],
                ].map(([label, name, type]) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      className="form-control"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                {/* Role Selection */}
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                    Role
                  </label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="trainer">Trainer</option>
                  </select>
                </div>

                {/* Conditional Fields */}
                {formData.role === "trainer" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                        Age
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {formData.role === "customer" && (
                  <>
                    {[
                      ["Weight (kg)", "weight"],
                      ["Height (cm)", "height"],
                      ["Body Type", "body_type"],
                    ].map(([label, name]) => (
                      <div className="mb-3" key={name}>
                        <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                          {label}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                  </>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn text-dark fw-bold shadow-lg rounded py-2"
                    style={{ backgroundColor: "#DAA520", borderColor: "gold" }}
                  >
                    Register
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <span className="fw-semibold text-dark">Already have an account?</span>{" "}
                <Link to="/login" className="fw-bold" style={{ color: "#4B0082" }}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
