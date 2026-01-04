const express = require('express')
const userAuth =  require('../middleware/authMiddleware')
const submit = require("../controllers/submissionController")
const submissionRouter = express.Router();


submissionRouter.post("/submit",userAuth, submit);


module.exports = submissionRouter;