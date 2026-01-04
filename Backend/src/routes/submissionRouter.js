const express = require('express')
const userAuth =  require('../middleware/authMiddleware')
const {submit, run} = require("../controllers/submissionController")
const submissionRouter = express.Router();


submissionRouter.post("/submit",userAuth, submit);
submissionRouter.post("/run", userAuth, run);


module.exports = submissionRouter;