const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Database Connection



// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use('/uploads', express.static('uploads'));
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import Routes
const userRoutes = require('./routes/userRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const customerRoutes = require('./routes/customerroutes');
const bmiRoutes = require('./routes/bmiRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const dietRoutes = require('./routes/dietRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require("./routes/adminRoutes")

// Use Routes
app.use('/api/users', userRoutes); // User Authentication & Registration
app.use('/api/trainers', trainerRoutes); // Trainer Details
app.use('/api/customers', customerRoutes); // Customer Profiles
app.use('/api/bmi', bmiRoutes); // BMI Calculator
app.use('/api/workouts', workoutRoutes); // Workout Plans
app.use('/api/diet', dietRoutes); // Diet Plans
app.use('/api/payment', paymentRoutes); // Payment Management
app.use("/api/admin",adminRoutes);//admin operations 

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Gym Membership Management System API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
