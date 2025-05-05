import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/Authcontext';
import gymBg from '../assets/gym_background.webp';

const BMICalculator = () => {
    const { userId } = useContext(AuthContext);
    const [bmi, setBmi] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            fetchBMIHistory();
        } else {
            setError("User ID not found. Please login again.");
        }
    }, [userId]);

    const calculateBMI = async () => {
        if (!userId) {
            setError("User ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.post('https://fitnesssystem.onrender.com/api/bmi/calculate', { userId });
            setBmi(response.data);
            fetchBMIHistory();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.error || 'Error calculating BMI. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBMIHistory = async () => {
        try {
            const response = await axios.get(`https://fitnesssystem.onrender.com/api/bmi/${userId}/history`);
            setHistory(response.data);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.error || 'Error fetching BMI history.');
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
            <div className="card bg-dark bg-opacity-75 text-light p-4 shadow-lg w-100" style={{ maxWidth: '800px' }}>
                <h2 className="text-center mb-4">BMI Calculator</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="text-center mb-4">
                    <button
                        onClick={calculateBMI}
                        className="btn btn-warning text-dark fw-bold px-5"
                        disabled={loading}
                    >
                        {loading ? 'Calculating...' : 'Calculate BMI'}
                    </button>
                </div>

                {bmi && (
                    <div className="alert mt-3" style={{
                        backgroundColor: '#ffe680',
                        color: '#1a1a1a',
                        border: '1px solid #e6c200',
                        borderRadius: '8px'
                    }}>
                        <p><strong>BMI:</strong> {bmi.bmi.toFixed(2)}</p>
                        <p><strong>Weight:</strong> {bmi.weight} kg</p>
                        <p><strong>Height:</strong> {bmi.height} cm</p>
                        <p><strong>Health Status:</strong> {getHealthStatus(bmi.bmi)}</p>
                        <p><strong>Calculated On:</strong> {new Date(bmi.createdAt).toLocaleString()}</p>
                    </div>
                )}

                <h4 className="text-center mt-5 mb-3">BMI History</h4>

                {history.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover rounded shadow-sm overflow-hidden">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(to right, #ffcc70, #ffdd99)',
                                    color: '#2c2c2c',
                                    fontWeight: 'bold'
                                }}>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Height (cm)</th>
                                    <th>BMI</th>
                                    <th>Health Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                                {history.map((entry, index) => (
                                    <tr key={index} style={{ transition: 'background 0.3s' }}>
                                        <td>{new Date(entry.createdAt).toLocaleString()}</td>
                                        <td>{entry.weight}</td>
                                        <td>{entry.height}</td>
                                        <td>{entry.bmi.toFixed(2)}</td>
                                        <td>{getHealthStatus(entry.bmi)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">No BMI records found.</p>
                )}
            </div>
        </div>
    );
};

export default BMICalculator;
