//routes/profiles.js
const express = require('express');
const router = express.Router();
const User = require('../models/Profiles');

// Function to convert date from YYYY-MM-DD to DD-MM-YYYY and vice versa
const formatDate = (dateStr, toBackend = true) => {
  if (!dateStr) return null; // Return null if no date is provided

  let [year, month, day] = dateStr.split('-');

  if (toBackend) {
    // Convert DD-MM-YYYY to YYYY-MM-DD for backend storage
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date format');
    }
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else {
    // Convert YYYY-MM-DD to DD-MM-YYYY for frontend display
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
};

// Create or Update User Profile
router.post('/profile', async (req, res) => {
  try {
    const { name, email, password, dob, occupation, workplace, expertise } = req.body;
    let profilePicture = '';

    const formattedDob = dob ? formatDate(dob) : null; // Use null if the date is not provided

    if (req.file) {
      profilePicture = req.file.path;
    }

    const user = await User.findOneAndUpdate({ email },
      { name, password, dob: formattedDob, occupation, workplace, profilePicture, expertise },
      { new: true, upsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get User Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.dob = user.dob ? formatDate(user.dob, false) : null; // Convert for frontend display

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, password, dob, occupation, workplace, expertise } = req.body;
    let profilePicture = '';

    const formattedDob = dob ? formatDate(dob) : null; // Use null if no valid date provided

    if (req.file) {
      profilePicture = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, password, dob: formattedDob, occupation, workplace, profilePicture, expertise },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete User Profile
router.delete('/profile/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
