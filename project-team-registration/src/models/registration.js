const pool = require('../config/db');

const createRegistration = async ({
  name, roll, email, phone, year, semester, branch, otherBranch, lang,
  otherLang, proficiency, area, experience, hours, learn, reason, confirm
}) => {
  const query = `
    INSERT INTO registrations (
      name, roll, email, phone, year, semester, branch, other_branch,
      languages, other_language, proficiency, area, experience, hours, learn, reason, confirm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    name, roll, email, phone, year, semester, branch, otherBranch || null,
    JSON.stringify(lang || []), otherLang || null, proficiency, area || null,
    experience || null, hours || null, learn || null, reason || null, confirm
  ];

  try {
    await pool.query(query, values);
    return { success: true, message: 'Registration successful' };
  } catch (err) {
    console.error('Error saving registration:', err);
    throw new Error('Failed to save registration');
  }
};

module.exports = { createRegistration };