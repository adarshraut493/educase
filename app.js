const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const schoolRoutes = require('./src/routes/schoolRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/api/schools', schoolRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));
