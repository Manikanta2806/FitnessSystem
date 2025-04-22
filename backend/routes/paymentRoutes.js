const express = require("express");
const Payment = require("../models/payments");
const User = require("../models/user");
const Trainer = require("../models/trainer");
const Customer = require("../models/customer"); // ✅ For customer-trainer mapping
const verifyTokenMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


/**
 * @route GET /api/trainer/salary/history/:trainerId
 * @desc Get salary history records for a trainer (read-only)
 * @access Private (Trainer or Admin)
 */
router.get("/trainer/history/:trainerId", verifyTokenMiddleware, async (req, res) => {
  try {
    const { trainerId } = req.params;

    const trainer = await Trainer.findOne({ user_id: trainerId }).populate("user_id", "username");
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }

    if (!trainer.salaryHistory || trainer.salaryHistory.length === 0) {
      return res.status(200).json({ message: "No salary records found.", salaryHistory: [] });
    }

    res.status(200).json({
      message: `Salary history for trainer ${trainer.user_id.username}`,
      salaryHistory: trainer.salaryHistory,
    });
  } catch (error) {
    console.error("[ERROR] Fetching salary history:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});


/**
 * @route POST /api/payment/pay
 * @desc Record a new payment and assign a trainer if needed
 * @access Private (Customer only)
 */
// Payment Route - Only handles payment logic
router.post("/pay", verifyTokenMiddleware, async (req, res) => {
  try {
    const user_id = req.user.userId; // Extracted from token
    console.log("[DEBUG] Payment user_id:", user_id);
    console.log("[DEBUG] Payment body:", req.body);

    const { plan_name, amount, membership_type, transaction_id, assigned_trainer } = req.body;

    // Basic validation
    if (!plan_name || !amount || !membership_type || !transaction_id) {
      return res.status(400).json({ error: "All payment fields are required." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount." });
    }

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the customer record linked to the user
    const customer = await Customer.findOne({ user_id: user_id });
    if (!customer) {
      return res.status(404).json({ error: "Customer profile not found." });
    }

    // If trainer-assisted, validate trainer exists
    if (membership_type === "trainer_assisted" && assigned_trainer) {
      const trainer = await Trainer.findById(assigned_trainer);
      if (!trainer) {
        return res.status(404).json({ error: "Assigned trainer not found." });
      }

      // Optional: check if customer is already assigned (up to you)
    }

    // Record the payment
    const newPayment = new Payment({
      user_id: user_id,
      plan_name,
      amount,
      membership_type,
      transaction_id,
      date: new Date(),
    });

    await newPayment.save();

    res.status(201).json({ message: "Payment successful!" });
  } catch (error) {
    console.error("[ERROR] Payment processing failed:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});


/**
 * @route GET /api/payment/history/:userId
 * @desc Customers see their own payments, Trainers see payments of their assigned customers
 * @access Private (Customer & Trainer)
 */
// Updated Route: Return payments for customer or trainer
// backend/routes/payment.js

router.get("/history/:userId", verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let payments = [];

    
      // Find the customer doc to get their assigned trainer
      const customer = await Customer.findOne({ user_id: userId })
        .populate({
          path: "assignedTrainer",
          populate: {
            path: "user_id",
            model: "User",
            select: "username email"
          }
        });

      // Fetch payments made by this customer
      payments = await Payment.find({ user_id: userId })
        .populate("user_id", "username email");

      // Manually add assigned_trainer info from the Customer model
      payments = payments.map(payment => {
        return {
          ...payment.toObject(),
          assigned_trainer: customer?.assignedTrainer?.user_id || null
        };
      });
    

    res.status(200).json(payments);
  } catch (err) {
    console.error("Payment fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch payment history." });
  }
});



module.exports = router;
