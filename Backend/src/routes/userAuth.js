const express = require('express')
const {register, verifyEmail, login, logout, resetPassword, registerAdmin} = require("../controllers/userAuthent");
const userAuth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");

const authRouter = express.Router();

// Register
authRouter.post('/register', register);
// // Login
authRouter.post('/login', login);
// // Logout
authRouter.post('/logout', userAuth, logout);
// // GetProfile
// authRouter.get('/profile', getProfile);
// // Forgot Password
// authRouter.post('/forgot-password', forgotPassword);
// // Reset Password
authRouter.patch('/reset-password', userAuth, resetPassword);
// // Verify email
authRouter.get('/verify-email', verifyEmail);


// Register Admin
authRouter.post('/admin/register', adminAuth, registerAdmin);

module.exports = authRouter;