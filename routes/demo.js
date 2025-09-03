const express = require('express');
const Submission = require('../models/Submission');
const router = express.Router();

// Submit demo request
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create new submission
    const submission = new Submission({ name, email, message });
    await submission.save();

    res.status(201).json({ message: 'Demo request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all submissions (protected route, for admin)
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
