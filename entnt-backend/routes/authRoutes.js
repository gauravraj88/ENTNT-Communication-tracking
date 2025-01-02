const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/protected", authenticateJWT, authController.getProtectedInfo);

module.exports = router;