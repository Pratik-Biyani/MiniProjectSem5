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
          // domain is required only if role = "startup"
          if (this.role === 'startup' && !value) {
            return false;
          }
          return true;
        },
        message: 'Domain is required for startups',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);