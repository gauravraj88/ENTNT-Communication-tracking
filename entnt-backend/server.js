// 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const CompanyRoutes = require('./routes/companyRoutes');
const CommRoutes = require('./routes/communicationMethodRoutes');
const AuthRoutes = require('./routes/authRoutes');
const NotificationRoutes = require('./routes/notificationRoutes');
const CommunicationRoutes = require('./routes/communicationRoutes');
const analyticsRoutes = require('./routes/analytics');
const User = require("./models/User");

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*', // Allowed origin
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    return User.countDocuments(); // Test connection by counting users
  })
  .then((count) => {
    console.log(`Database has ${count} users`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    process.exit(1);
  });

// Handle MongoDB errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error after initial connection:', err);
});

// Environment Configuration Check
console.log('Environment check:', {
  mongoUrl: process.env.MONGO_URL?.substring(0, 20) + '...', // Log partial URL for security
  jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
});

// Routes
app.use("/api/companies", CompanyRoutes);
app.use("/api/communications", CommRoutes);
app.use("/api/notifications", NotificationRoutes);
app.use("/api/communications-user", CommunicationRoutes);
app.use("/api", AuthRoutes);
app.use('/api/analytics', analyticsRoutes);

// Start Server
const PORT = process.env.PORT || 5123;
app.listen(PORT, () => {
  console.log(`\n\nServer running on http://localhost:${PORT} ✅\n\n`);
});
