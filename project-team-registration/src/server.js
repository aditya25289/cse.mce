const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registrationRoutes = require('./routes/registration');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Routes
app.use('/api', registrationRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});