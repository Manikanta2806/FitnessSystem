const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    plan: { type: String, required: true }, // JSON of exercises
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'pending'], default: 'active' }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
