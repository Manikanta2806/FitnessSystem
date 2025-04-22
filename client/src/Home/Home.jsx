import React, { useContext } from "react";
import { AuthContext } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/homebackground.webp";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: "🏋️‍♂️ Expert Training",
      description: "Get 1-on-1 coaching from certified trainers.",
      color: "text-primary",
      image: "https://media.istockphoto.com/id/675179390/photo/muscular-trainer-writing-on-clipboard.jpg?s=612x612&w=0&k=20&c=9NKx1AwVMpPY0YBlk5H-hxx2vJSCu1Wc78BKRM9wFq0=",
    },
    {
      title: "🥗 Custom Nutrition",
      description: "Personalized meal plans to match your fitness goals.",
      color: "text-success",
      image: "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=",
    },
    {
      title: "💪 Community Power",
      description: "Stay motivated with like-minded fitness lovers.",
      color: "text-danger",
      image: "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex flex-column text-white position-relative"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
      }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }} />

      {/* Hero Section */}
      <div className="container py-5 z-1 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="display-3 fw-bold text-warning mb-3">Unleash Your Potential</h1>
          <p className="fs-4 text-white mb-4">
            Transform your body, mind, and lifestyle with <span className="text-danger fw-bold">FitZone</span>.
          </p>

          {!user ? (
            <button
              className="btn btn-warning btn-lg px-5 py-2 fw-bold shadow"
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          ) : (
            <button
              className="btn btn-success btn-lg px-5 py-2 fw-bold shadow"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container z-1 mb-5">
        <div className="row g-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="card glass-card text-center shadow border-0 h-100">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
                <div className="card-body p-4">
                  <h5 className={`fw-bold mb-3 ${feature.color}`}>{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Style for glassmorphism cards */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}
