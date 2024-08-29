//models/Profiles.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: String }, // Store DOB as a string
  occupation: { type: String },
  workplace: { type: String },
  expertise: { type: String },
  profilePicture: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
