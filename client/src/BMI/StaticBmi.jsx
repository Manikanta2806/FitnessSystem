import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import gymBg from '../assets/gym_background.webp';

const StaticBMICalculator = () => {
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h && w && h > 0 && w > 0) {
      const bmiValue = w / ((h / 100) * (h / 100));
      setBmiResult({
        bmi: bmiValue.toFixed(2),
        weight: w,
        height: h,
        healthStatus: getHealthStatus(bmiValue),
        timestamp: new Date().toLocaleString(),
      });
      setShowModal(false);
    } else {
      alert("Please enter valid weight and height");
    }
  };

  const getHealthStatus = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
  };

  return (
    <div
      className="bmi-container text-white d-flex justify-content-center align-items-center py-5"
      style={{
        backgroundImage: `url(${gymBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="card bg-dark bg-opacity-75 text-light p-4 shadow-lg w-100" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Static BMI Calculator</h2>

        <div className="text-center mb-4">
          <Button variant="warning" className="text-dark fw-bold px-4 py-2" onClick={() => setShowModal(true)}>
            Enter Height & Weight
          </Button>
        </div>

        {bmiResult && (
          <div className="alert mt-3" style={{
            backgroundColor: '#ffe680',
            color: '#1a1a1a',
            border: '1px solid #e6c200',
            borderRadius: '8px'
          }}>
            <p><strong>BMI:</strong> {bmiResult.bmi}</p>
            <p><strong>Weight:</strong> {bmiResult.weight} kg</p>
            <p><strong>Height:</strong> {bmiResult.height} cm</p>
            <p><strong>Health Status:</strong> {bmiResult.healthStatus}</p>
            <p><strong>Calculated On:</strong> {bmiResult.timestamp}</p>
          </div>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Your Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formWeight" className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 70"
                />
              </Form.Group>

              <Form.Group controlId="formHeight" className="mb-3">
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 175"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={calculateBMI}>
              Calculate
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default StaticBMICalculator;
