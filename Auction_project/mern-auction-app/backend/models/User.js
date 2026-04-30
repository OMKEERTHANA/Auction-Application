const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the Schema (Structure of the document)
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // By default, anyone registering is a standard 'user'
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 2. Instance Method: Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password stored in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3. Pre-save Hook: Hash the password before saving to DB
userSchema.pre('save', async function (next) {
  // If the password hasn't been modified, move to the next middleware
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt (random string) and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Create and export the Model
const User = mongoose.model('User', userSchema);

module.exports = User;
