const validateProblem = require("../utils/validateProblem")
const {getLanguageId, submitBatch, getBatchResult} = require("../utils/ProblemId")
const Problem = require("../models/problem");
const User = require("../models/user")
const { populate } = require("../models/user");

const createProblem = async (req, res)=>{

    validateProblem(req.body);

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try{

        for(const {language, completeCode} of referenceSolution){
                // Source Code
                // Language_id
                // input
                // output
                try{
                    const languageId = getLanguageId(language);
                    const submissions = visibleTestCases.map(({input, output})=>{
                        return {
                            source_code : completeCode,
                            language_id : languageId,
                            stdin : input,
                            expected_output: output
                        }
                    })

                    const result = await  submitBatch(submissions);

                    const tokenArray = result.map((obj)=>{
                        return obj.token;
                    })
                    const tokenString = tokenArray.join(",")
                    const batchResult = await getBatchResult(tokenString);

                    for(batch of batchResult){
                        console.log(batch)
                        if(batch.status_id == 4)
                            return res.status(400).send("Wrong Answer")
                        if(batch.status_id == 5)
                            return res.status(400).send("Time limit Exceeded")
                        if(batch.status_id == 6)
                            return res.status(400).send("Compilation Error")
                        if(batch.status_id > 6)
                            return res.status(400).send("Runtime Error")
                    }
                    
                }catch(err)
                {
                    res.status(500).json({message: err.message});
                }
               
        }

        await Problem.create({...req.body, problemCreator: req.result._id})
        res.status(201).send("Problem creted successfully")

    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
}

const updateProblem = async (req, res)=>{
    validateProblem(req.body);
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;
    const {id} = req.params;

      try{

        if(!id)
            return res.status(404).send("Id not found");

        const prb = await Problem.findById(id);
        if(!prb)
            return res.status(404).send("Problem not found");

        for(const {language, completeCode} of referenceSolution){
                // Source Code
                // Language_id
                // input
                // output
                try{
                    const languageId = getLanguageId(language);
                    const submissions = visibleTestCases.map(({input, output})=>{
                        return {
                            source_code : completeCode,
                            language_id : languageId,
                            stdin : input,
                            expected_output: output
                        }
                    })

                    const result = await  submitBatch(submissions);

                    const tokenArray = result.map((obj)=>{
                        return obj.token;
                    })
                    const tokenString = tokenArray.join(",")
                    const batchResult = await getBatchResult(tokenString);

                    for(batch of batchResult){
                        console.log(batch)
                        if(batch.status_id == 4)
                            return res.status(400).send("Wrong Answer")
                        if(batch.status_id == 5)
                            return res.status(400).send("Time limit Exceeded")
                        if(batch.status_id == 6)
                            return res.status(400).send("Compilation Error")
                        if(batch.status_id > 6)
                            return res.status(400).send("Runtime Error")
                    }
                    
                }catch(err)
                {
                    res.status(500).json({message: err.message});
                }
               
        }

        const updatedProblem = await Problem.findByIdAndUpdate( id ,{...req.body, problemCreator: req.result._id},{runValidators:true})
        res.status(201).send(updatedProblem)

    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
}

const deleteProblem = async(req, res)=>{
    try{
        const {id} = req.params;
        if(!id)
            return res.status(404).send("Problem Id not found");

        await Problem.findByIdAndDelete(id);
        

        res.status(201).send("Problem deleted successfully");
    }
    catch(err)
    {
        res.status(404).send("Problem doesnt exist")
    }
}

const getProblem = async(req, res)=>{
    const {id} = req.params;
    try{
        if(!id)
            return res.status(404).send("Id not found");

        const prb = await Problem.findById(id);
        if(!prb)
            return res.status(404).send("Problem not found");

        res.status(200).send(prb);
    }   
    catch(err)
    {
        res.status(500).send("Internal server error");
    }
}   

const getAllProblems = async(req, res)=>{
    const {page, limit} = req.query;
    try{
        if(!page || !limit)
            return res.status(404).send("One of the query is missing");

        const allProblems = await Problem.find({}).skip(Number((page-1)*limit)).limit(Number(limit));
        console.log(allProblems);
        if(!allProblems.length)
            return res.status(404).send("No problems found");

        res.status(200).send(allProblems)
    }catch(err)
    {
        res.status(500).send("Internal server error");
    }
}


const getSolvedProblems = async(req, res)=>{
    try{
        const id = req.result._id;

        const user = await User.findById(id).populate({
            path: "problemSolved",
            select: ["title", "_id", "description", "difficulty"] 
        })
        res.status(200).send(user.problemSolved);
    }
    catch(err)
    {
        res.status(500).send("Internal server error: "+ err.message);
    }
}


module.exports = {createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getSolvedProblems}