const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  morning: { type: String },
  afternoon: { type: String },
  evening: { type: String },
  night: { type: String },
});

const dietPlanSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  weight: { type: Number, required: true },
  weekPlan: {
    Monday: mealSchema,
    Tuesday: mealSchema,
    Wednesday: mealSchema,
    Thursday: mealSchema,
    Friday: mealSchema,
    Saturday: mealSchema,
    Sunday: mealSchema,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
