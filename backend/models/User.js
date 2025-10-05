// models/User.js - Complete updated version
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: { 
      type: String, 
      enum: ['admin', 'startup', 'investor'], 
      required: [true, 'Role is required'] 
    },
    isSubscribed: { 
      type: Boolean, 
      default: true 
    },
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
  { 
    timestamps: true 
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);