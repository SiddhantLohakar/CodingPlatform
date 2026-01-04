const express = require('express')
const adminAuth = require('../middleware/adminAuthMiddleware')
const {createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getSolvedProblems} = require("../controllers/problemController")
const userAuth = require("../middleware/authMiddleware")

const problemRouter= express.Router();

// Create
problemRouter.post("/create",adminAuth, createProblem);
// Fetch
problemRouter.get("/getProblem/:id",userAuth, getProblem);
problemRouter.get("/getAllProblems",userAuth, getAllProblems);
problemRouter.get("/getSolvedProblemByUser",userAuth, getSolvedProblems);

// Update 
problemRouter.put("/update/:id",adminAuth, updateProblem);

// Delete
problemRouter.delete("/delete/:id",adminAuth, deleteProblem);

module.exports = problemRouter