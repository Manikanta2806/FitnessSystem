const express = require('express');
const Trainer = require('../models/trainer');
const User = require('../models/user');
const Customer = require('../models/customer');

const router = express.Router();

// Get All Trainers
router.get('/all', async (req, res) => {
    try {
        const trainers = await Trainer.find().populate('user_id', 'username email');
        res.json(trainers || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get trainer details
router.get('/:trainerId', async (req, res) => {
    try {
      const trainer = await Trainer.findById(req.params.trainerId).populate('user_id', 'username email');
      if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
  
      res.json(trainer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Assign a Customer to a Trainer
// Assign a Customer to a Trainer
router.post('/custassign', async (req, res) => {
    try {
      const { trainerId, customerId, membershipPlan } = req.body;
  
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
  
      const customer = await Customer.findOne({ user_id: customerId });
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
  
      const user = await User.findById(customerId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Update trainer's customer list
      if (!trainer.customers.includes(customerId)) {
        trainer.customers.push(customerId);
        await trainer.save();
      }
  
      // Update customer's assigned trainer
      customer.assignedTrainer = trainer._id;
      await customer.save();
  
      // Update user with membership details
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month
  
      user.membershipPlan = membershipPlan;
      user.membershipExpiry = expiryDate;
      user.paymentStatus = 'Paid';
  
      await user.save();
  
      res.json({ message: 'Customer assigned to trainer and membership updated successfully' });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Get Customers Assigned to a Trainer
router.get('/:trainerId/customers', async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.trainerId).populate('customers', 'username email');
        if (!trainer) return res.status(404).json({ error: 'Trainer not found' });

        res.json(trainer.customers || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
