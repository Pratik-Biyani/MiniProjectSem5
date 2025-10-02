// models/User.js - Updated schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['admin', 'startup', 'investor'], required: true },
    isSubscribed: { type: Boolean, default: true },

    domain: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.role === 'startup' && !value) {
            return false;
          }
          return true;
        },
        message: 'Domain is required for startups',
      },
    },

    // Enhanced subscription fields
    subscription: {
      plan: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due'],
        default: 'active'
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);