import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/homebackground.webp";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [errorTrainers, setErrorTrainers] = useState(null);
  const [errorCustomers, setErrorCustomers] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/trainers/all");
        const data = await res.json();
        if (Array.isArray(data)) setTrainers(data);
        else throw new Error("Invalid trainer data format");
      } catch (err) {
        setErrorTrainers(err.message);
      } finally {
        setLoadingTrainers(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/customers/allc");
        const data = await res.json();
        if (Array.isArray(data)) setCustomers(data);
        else throw new Error("Invalid customer data format");
      } catch (err) {
        setErrorCustomers(err.message);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchTrainers();
    fetchCustomers();
  }, []);

  return (
    <div
      className="vh-100 d-flex flex-column align-items-center justify-content-center text-white text-center position-relative"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      {/* Trainers Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="shadow-lg position-relative"
      >
        <h1 className="display-3 fw-bold text-warning">Meet Our Trainers</h1>
        <p className="fs-4">Find expert guidance and transform your fitness journey.</p>
      </motion.div>

      <div className="container mt-5 position-relative">
        {loadingTrainers ? (
          <p className="text-warning">Loading trainers...</p>
        ) : errorTrainers ? (
          <p className="text-danger">Error: {errorTrainers}</p>
        ) : trainers.length === 0 ? (
          <p className="text-light">No trainers available</p>
        ) : (
          <div className="row g-4">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="col-md-4">
                <motion.div
                  className="card border-0 shadow-lg text-center"
                  style={{ backgroundColor: "#FFD700", borderRadius: "15px", color: "#4B0082" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="card-body">
                    <h3 className="h5 fw-bold">{trainer.user_id.username}</h3>
                    <p>{trainer.user_id.email}</p>
                    <button
                      className="btn btn-dark mt-2"
                      onClick={() => navigate(`/trainer/${trainer._id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-5 position-relative"
      >
        <h1 className="display-4 fw-bold text-warning">Our Customers</h1>
        <p className="fs-4">See the people training with us.</p>
      </motion.div>

      <div className="container mt-4 position-relative">
        {loadingCustomers ? (
          <p className="text-warning">Loading customers...</p>
        ) : errorCustomers ? (
          <p className="text-danger">Error: {errorCustomers}</p>
        ) : customers.length === 0 ? (
          <p className="text-light">No customers available</p>
        ) : (
          <div className="row g-4">
            {customers.map((customer) => {
              const trainerUsername = customer.assignedTrainer?.user_id?.username;

              return (
                <div key={customer._id} className="col-md-4">
                  <motion.div
                    className="card border-0 shadow-lg text-center"
                    style={{ backgroundColor: "#FFD700", borderRadius: "15px", color: "#4B0082" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="card-body">
                      <h3 className="h5 fw-bold">{customer.user_id.username}</h3>
                      <p>{customer.user_id.email}</p>
                      <p className="fw-semibold">
                        Trainer:{" "}
                        {trainerUsername
                          ? trainerUsername
                          : customer.assignedTrainer
                          ? "Trainer Info Missing"
                          : "Not Assigned"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
