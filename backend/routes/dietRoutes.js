// routes/dietplan.js
const express = require('express');
const DietPlan = require('../models/deitplan');
const router = express.Router();

// Get Diet Plans for a Customer
// GET /api/diet/customer/:id
router.get('/customer/:id', async (req, res) => {
    try {
      const plan = await DietPlan.findOne({ customer_id: req.params.id });
      if (!plan) return res.status(404).json({ message: "No diet plan found" });
      res.json(plan);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
// Add a Diet Plan
router.post('/add', async (req, res) => {
  try {
    const { customer_id, trainer_id, weight, weekPlan } = req.body;

    const diet = new DietPlan({
      customer_id,
      trainer_id,
      weight,
      weekPlan,
    });

    await diet.save();
    res.json({ message: 'Diet plan created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
