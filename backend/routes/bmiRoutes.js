const express = require('express');
const BMI = require('../models/bmi');
const Customer = require('../models/customer'); // Import Customer model

const router = express.Router();

/**
 * @route POST /api/bmi/calculate
 * @desc Calculate BMI for a user using weight and height from Customer model
 * @access Private
 */
router.post('/calculate', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        // Find customer using userId
        const customer = await Customer.findOne({ user_id:userId });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found.",
                "object":customer
             });
        }

        const { _id: customerId, weight, height } = customer;

        if (!weight || !height) {
            return res.status(400).json({ error: "Customer's weight or height is missing." });
        }

        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);

        const bmiRecord = new BMI({
            customerId,
            weight,
            height,
            bmi: bmiValue,
        });

        await bmiRecord.save();

        res.json({
            message: "BMI calculated successfully.",
            bmi: bmiValue,
            weight,
            height,
            createdAt: bmiRecord.createdAt,
        });
    } catch (error) {
        console.error("Error calculating BMI:", error);
        res.status(500).json({ error: "Server error while calculating BMI." });
    }
});

/**
 * @route GET /api/bmi/:userId/history
 * @desc Get BMI history based on userId via customer
 * @access Private
 */
router.get('/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const customer = await Customer.findOne({ user_id:userId });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found." });
        }

        const bmiHistory = await BMI.find({ customerId: customer._id }).sort({ createdAt: -1 });
        res.json(bmiHistory);
    } catch (error) {
        console.error("Error fetching BMI history:", error);
        res.status(500).json({ error: "Server error while fetching history." });
    }
});

module.exports = router;
