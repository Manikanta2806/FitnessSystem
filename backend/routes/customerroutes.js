const express = require('express');
const Customer = require('../models/customer');

const router = express.Router();

// ✅ Get All Customers (UPDATED)
router.get("/allc", async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("user_id") // ✅ Populate customer's user info
      .populate({
        path: "assignedTrainer",
        populate: { path: "user_id", model: "User" }, // ✅ Populate trainer's user info
      });

    res.status(200).json(customers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Single Customer Profile by ID
router.get('/:customerId/profile', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId)
      .populate("user_id")
      .populate({
        path: "assignedTrainer",
        populate: { path: "user_id", model: "User" },
      });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Customer Data
router.put('/:customerId/update', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("user_id")
      .populate({
        path: "assignedTrainer",
        populate: { path: "user_id", model: "User" },
      });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 Get Current User's Customer Profile
router.get('/me/profile', async (req, res) => {
  try {
    const userId = req.user._id;
    const customer = await Customer.findOne({ user_id: userId })
      .populate("user_id")
      .populate({
        path: "assignedTrainer",
        populate: { path: "user_id", model: "User" },
      });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
