const express = require("express");
const WorkoutPlan = require("../models/workoutplan");
const Customer = require("../models/customer");
const Trainer = require("../models/trainer");

const router = express.Router();

// ✅ Get trainer's customers
router.get("/trainer-with-customers/:userId", async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user_id: req.params.userId })
      .populate({
        path: "customers",
        populate: {
          path: "user_id",
          model: "User",
        },
      });

    if (!trainer) return res.status(404).json({ error: "Trainer not found" });

    res.json(trainer.customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get workout plans for a specific customer by their user_id
router.get("/:customerUserId", async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ customer_id:  req.params.customerUserId  });
    res.json(plans);
  } catch (err) {
    console.error("Error fetching workout plans:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Add workout plan
router.post("/add", async (req, res) => {
  try {
    const workout = new WorkoutPlan(req.body);
    await workout.save();
    res.json({ message: "Workout plan created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update workout plan
router.put("/update/:id", async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndUpdate(req.params.id, {
      plan: req.body.plan,
    });
    res.json({ message: "Workout plan updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
