const express = require('express')
const {register, verifyEmail, login} = require("../controllers/userAuthent");

const authRouter = express.Router();

// Register
authRouter.post('/register', register);
// // Login
authRouter.post('/login', login);
// // Logout
// authRouter.post('/logout', logout);
// // GetProfile
// authRouter.get('/profile', getProfile);
// // Forgot Password
// authRouter.post('/forgot-password', forgotPassword);
// // Reset Password
// authRouter.post('/reset-password', resetPassword);
// // Verify email
authRouter.get('/verify-email', verifyEmail);
// // Change Password
// authRouter.patch('/change-password', changePasword);

module.exports = authRouter;