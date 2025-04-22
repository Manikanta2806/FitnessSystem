const express = require('express');
const router = express.Router();
const Trainer = require('../models/trainer');
const Customer = require('../models/customer');
const User=require("../models/user");
const bcrypt = require('bcryptjs');

// ✅ Get All Trainers with user details and salary history
// routes/admin.js or wherever the route is defined
router.get("/all", async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("user_id")        // Populate trainer's user info
      .populate({
        path: "customers",        // Populate the 'customers' array
        populate: {
          path: "user_id",        // Populate each customer's user info
          model: "User",          // Also populate each customer's user info
        },
      });

    res.json(trainers);
  } catch (err) {
    console.error("Error fetching trainers with customers:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// Get all customers with assignedTrainer's user info
router.get("/allc", async (req, res) => {
  try {
    const customers = await Customer.find().populate({
      path: "assignedTrainer",
      populate: { path: "user_id", model: "User" },
    });
    res.status(200).json(customers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trainers-with-customers', async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate({
        path: 'customers',
        select: 'name email', // Adjust fields as needed
        model: 'Customer'
      })
      .populate({
        path: 'user_id',
        select: 'name email', // if user_id refers to a user
        model: 'User'
      });

    res.status(200).json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ✅ Pay Trainer Salary for a Given Month & Year
// ✅ Pay Trainer Salary for a Given Month & Year
router.post('/pay', async (req, res) => {
    try {
      const { trainerId, month, year } = req.body;
  
      if (!trainerId || !month || !year) {
        return res.status(400).json({ error: "trainerId, month and year are required" });
      }
  
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }
  
      // Check if already paid
      const alreadyPaid = trainer.salaryHistory.some(
        (entry) => entry.month === month && entry.year === year
      );
  
      if (alreadyPaid) {
        return res.status(400).json({ message: "Salary already paid for this period" });
      }
  
      // ✅ Dynamically calculate salary based on experience
      let calculatedSalary = 750; // default
      if (trainer.experience >= 3) {
        calculatedSalary = 900;
      } else if (trainer.experience >= 1) {
        calculatedSalary = 800;
      }
  
      // Add salary record
      trainer.salaryHistory.push({
        amount: calculatedSalary,
        status: 'Paid',
        paidDate: new Date(),
        month,
        year
      });
  
      await trainer.save();
  
      res.status(200).json({ message: "Salary paid successfully!", salary: calculatedSalary });
    } catch (error) {
      console.error("Error processing salary payment:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/register-admin', async (req, res) => {
    try {
      const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already registered." });
      }
  
      const hashedPassword = await bcrypt.hash("admin143", 10);
  
      const adminUser = new User({
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        mobile: "7286817141",
        role: "admin"
      });
  
      await adminUser.save();
  
      res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
      console.error("Error registering admin:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
