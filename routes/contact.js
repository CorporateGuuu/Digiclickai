const express = require('express');
const Submission = require('../models/Submission');
const router = express.Router();

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create new submission
    const submission = new Submission({
      name,
      email,
      message: phone ? `${message}\n\nPhone: ${phone}` : message
    });
    await submission.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all contact submissions (protected route, for admin)
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
