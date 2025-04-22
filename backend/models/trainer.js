const mongoose = require('mongoose');

// Subschema for salary payment history
const salaryHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 750,
    max: 900,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending',
  },
  paidDate: {
    type: Date,
    default: null,
  },
  month: {
    type: String,
    required: true, // e.g., "April"
  },
  year: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const trainerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  customers: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
  }],
  salary: {
    type: Number,
    default: 750,
    min: 750,
    max: 900
  },
  salaryHistory: [salaryHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
