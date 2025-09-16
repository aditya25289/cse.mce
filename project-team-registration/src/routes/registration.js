const express = require('express');
const router = express.Router();
const { createRegistration } = require('../models/registration');

router.post('/register', async (req, res) => {
  const {
    name, roll, email, phone, year, semester, branch, otherBranch, lang, otherLang,
    proficiency, area, experience, hours, learn, reason, confirm
  } = req.body;

  // Validate required fields
  if (!name || !roll || !email || !phone || !year || !semester || !branch || !confirm) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  // Validate branch and semester restrictions
  if (branch !== 'CSE') {
    return res.status(400).json({ error: 'Only CSE students are eligible' });
  }
  if (semester !== '2nd Semester') {
    return res.status(400).json({ error: 'Only 2nd Semester students are eligible' });
  }

  // Validate phone number
  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number starting with 6–9' });
  }

  try {
    const result = await createRegistration(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;