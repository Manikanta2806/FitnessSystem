import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import backgroundImage from "../assets/gym_background.webp"; // Save the provided image locally and use this path

export default function TrainerProfile() {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await fetch(`https://fitnesssystem.onrender.com/api/trainers/${trainerId}`);
        const data = await response.json();

        if (data && data._id) {
          setTrainer(data);
        } else {
          throw new Error("Trainer not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerDetails();
  }, [trainerId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={styles.background}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={styles.background}>
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  return (
    <div style={styles.background}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={styles.card}>
              <div className="card-body text-center text-dark rounded">
                <h2 className="fw-bold">{trainer.user_id.username}</h2>
                <p className="text-muted">{trainer.user_id.email}</p>

                <div className="mt-4">
                  <h5 className="fw-semibold">
                    <i className="bi bi-star-fill text-warning"></i> Experience: {trainer.experience} years
                  </h5>
                  <h5 className="fw-semibold">
                    <i className="bi bi-person-fill text-info"></i> Age: {trainer.age} years
                  </h5>
                </div>

                <button className="btn btn-dark mt-3">
                  <i className="bi bi-chat-left-dots"></i> Contact Trainer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `url(${backgroundImage}) no-repeat center center/cover`,
  },
  card: {
    backgroundColor: "#FFD700",
    borderRadius: "15px",
  },
};
