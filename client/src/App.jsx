import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/Context/Authcontext"; // Ensure correct casing
import Register from "./Register/Register";
import Navbar from "./Navigation/Navigation"; // Ensure correct casing
import Home from "./Home/Home"
import Login from "./Login/Login"
import Dashboard from "./Dashboard/Dashboard";
import TrainerProfile from "./Dashboard/TrainerProfile";
import PaymentForm from "./Payment/PaymentForm";
import PaymentHistory from "./Payment/PaymentHistory";
import BMICalculator from "./BMI/Bmi";
import Profile from "./Profile/Profile";
import TrainerCustomerDashboard from "../Admin/TrainerCustomerDashboard";
import TrainerHistory from "./Payment/trainerPayment";
import StaticBMICalculator from "./BMI/StaticBmi";
import CustomerWorkoutPage from "./Workout/CustomerWorkoutPage";
import TrainerWorkoutFormPage from "./Workout/TrainerWorkoutFormPage";
import TrainerCustomerWorkoutViewPage from "./Workout/TrainerCustomerWorkoutViewPage";
import AddDietPlan from "./Diet/addDiet";
import DietPlanView from "./Diet/Dietview";
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar /> {/* Corrected component name */}
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/" element={<Home/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/trainer/:trainerId" element={<TrainerProfile/>} />
                    <Route path="/paymenthistory" element={<PaymentHistory/>} />
                    <Route path="/paymentform" element={<PaymentForm/>} />
                    <Route path="/bmi" element={<BMICalculator/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/adminquery" element={<TrainerCustomerDashboard/>} />
                    <Route path="/trainerhistory" element={<TrainerHistory/>} />
                    <Route path="/bmitrainer" element={<StaticBMICalculator/>} />
                    <Route path="/showworkout" element={<CustomerWorkoutPage/>} />
                    <Route path="/addworkout" element={<TrainerWorkoutFormPage/>} />
                    <Route path="/showtrainerworkout" element={<TrainerCustomerWorkoutViewPage/>} />
                    <Route path="/adddiet" element={<AddDietPlan/>} />
                    <Route path="/dietview" element={<DietPlanView/>} />

                    
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
