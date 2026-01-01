const validateProblem = require("../utils/validateProblem")
const {getLanguageId, submitBatch, getBatchResult} = require("../utils/ProblemId")
 const Problem = require("../models/problem")

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
                    res.status().json({message: err.message});
                }
               
        }

        await Problem.create({...req.body, problemCreator: req.result._id})
        res.status(201).send("Problem creted successfully")

    }catch(err)
    {
        res.status().json({message: err.message});
    }
}

module.exports = createProblem