const express = require('express')
const adminAuth = require('../middleware/adminAuthMiddleware')
const createProblem = require("../controllers/problemController")


const problemRouter= express.Router();

// Create
problemRouter.post("/create",adminAuth, createProblem);
// Fetch
// problemRouter.get("/:id", getProblem);
// problemRouter.get("/", getAllProblems);
// problemRouter.get("/user", getSolvedProblems);

// Update 
// problemRouter.patch("/:id", updateProblem);

// Delete
// problemRouter.delete("/:id", deleteProblem);

module.exports = problemRouter