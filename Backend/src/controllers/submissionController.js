const Problem = require('../models/problem')
const {getLanguageId, submitBatch, getBatchResult} = require("../utils/ProblemId")
const Submission =  require("../models/submission")


// async function submit(req, res){
   
//     const data = req.body;

//     if(!data || !data.problemId || !data.inputCode || !data.language){
//         return res.status(400).json({"message": " problemId, inputCode and language are required"});
//     }

//     const problem = await Problem.findById(data.problemId);

//     if(!problem)
//         return res.status(404).json({"message" : "Problem ut found"});


//     const initialSubmit = {
//         userId : req.result._id,
//         problemId: data.problemId,
//         inputCode : data.inputCode,
//         status: "pending", // Initially status is pendin
//         runtime: 0,
//         memory: 0,
//         language: data.language,
//         error: "null",
//         passedCases: 0
//     }

//     const submission = await Submission.create(initialSubmit);
    
//     try{
//         const languageId = getLanguageId(data.language);
//         const totalTestCases = [...problem.visibleTestCases , ...problem.hiddenTestCases];
        
//         const Batch =  totalTestCases.map(({input, output})=>{
//             return{
//                 source_code: data.inputCode,
//                 language_id: languageId,
//                 stdin: input,
//                 expected_output: output
//             }
//         })

//         const result = await submitBatch(Batch);

//         const tokenArray = result.map((obj)=>{
//             return obj.token;
//         })
//         const tokenString = tokenArray.join(",")
//         const batchResult = await getBatchResult(tokenString);


//         let testPassed = 0;
//         let status = "accepted";
//         let runtime = 0;
//         let memory = 0;
//         let errorMessage = null;

//         for(let batch of batchResult)
//         {
//             if(batch.status_id == 3)
//             {
//                 testPassed++;
//                 runtime = runtime + parseFloat(batch.time);
//                 memory = Math.max(memory, batch.memory);
//             }
//             else{
//                 status = "wrong";
//                 errorMessage = batch.stderr;
//             }
//         }

//         console.log(errorMessage);

//         submission.status = status;
//         submission.passedCases = testPassed;
//         submission.memory = memory;
//         submission.runtime = runtime;
//         submission.error = errorMessage? errorMessage : "null"

//         await submission.save();

//         // Adding the solved problem's problem id to the user
     
//         if(!req.result.problemSolved.includes(data.problemId))
//         {
//             req.result.problemSolved.push(data.problemId);
//             await req.result.save();
//         }
//         res.status(201).send(submission);



//     }catch(err)
//     {
//         res.status(500).send("Internal Server : "+ err.message);
//     }




// }

// async function run(req, res){
//      const data = req.body;

//     if(!data || !data.problemId || !data.inputCode || !data.language){
//         return res.status(400).json({"message": " problemId, inputCode and language are required"});
//     }

//     const problem = await Problem.findById(data.problemId);

//     if(!problem)
//         return res.status(404).json({"message" : "Problem not found"});

    
//     try{
//         const languageId = getLanguageId(data.language);
        
        
//         const Batch =  problem.visibleTestCases.map(({input, output})=>{
//             return{
//                 source_code: data.inputCode,
//                 language_id: languageId,
//                 stdin: input,
//                 expected_output: output
//             }
//         })

//         const result = await submitBatch(Batch);

//         const tokenArray = result.map((obj)=>{
//             return obj.token;
//         })
//         const tokenString = tokenArray.join(",")
//         const batchResult = await getBatchResult(tokenString);
//         res.status(201).send(batchResult);



//     }catch(err)
//     {
//         res.status(500).send("Internal Server : "+ err.message);
//     }



// }



async function run(req, res){
    const data = req.body;
    
    if(!data || !data.problemId || !data.inputCode || !data.language){
        return res.status(400).json({"message": " problemId, inputCode and language are required"});
    }

    const problem = await Problem.findById(data.problemId);

    if(!problem)
        return res.status(404).json({"message" : "Problem not found"});

    
    try{
        const languageId = getLanguageId(data.language);
        
        const languageCode = problem.startCode.find((value)=>value.language == data.language);
       
        if (data.language === "java") {

            data.inputCode =
                languageCode.initialCode.header +
                "\npublic class Main {\n" +
                data.inputCode +
                "\n" +
                languageCode.initialCode.main +
                "\n}";

        } else {
            data.inputCode =
                languageCode.initialCode.header +
                "\n" +
                data.inputCode +
                "\n" +
                languageCode.initialCode.main;
        }
       
        const Batch = problem.visibleTestCases.map(({input, output})=>{
            return{
                source_code: data.inputCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }
        })

        const result = await submitBatch(Batch);

        const tokenArray = result.map((obj)=>{
            return obj.token;
        })
        const tokenString = tokenArray.join(",")
        const batchResult = await getBatchResult(tokenString);

        // Transform the response
        const transformedResults = batchResult.map((batch, index) => {
            return {
                input: problem.visibleTestCases[index].input,
                output: problem.visibleTestCases[index].output,
                explaination: problem.visibleTestCases[index].explaination || null,
                passed: batch.status_id === 3,
                actualOutput: batch.stdout ? batch.stdout.trim() : null,
                error: batch.stderr || batch.compile_output || null,
                status: batch.status.description
            }
        });

        res.status(200).json(transformedResults);

    }catch(err){
        res.status(500).send("Internal Server : "+ err.message);
    }
}

async function submit(req, res){
   
    const data = req.body;

    if(!data || !data.problemId || !data.inputCode || !data.language){
        return res.status(400).json({"message": " problemId, inputCode and language are required"});
    }

    const problem = await Problem.findById(data.problemId);

    if(!problem)
        return res.status(404).json({"message" : "Problem not found"});


    const initialSubmit = {
        userId : req.result._id,
        problemId: data.problemId,
        inputCode : data.inputCode,
        status: "pending",
        runtime: 0,
        memory: 0,
        language: data.language,
        error: "null",
        passedCases: 0
    }

    const submission = await Submission.create(initialSubmit);
    
    try{
        const languageId = getLanguageId(data.language);
        const totalTestCases = [...problem.visibleTestCases , ...problem.hiddenTestCases];
        const languageCode = problem.startCode.find((value)=>value.language == data.language);
        let code = "";
        if (data.language === "java") {

            code =
                languageCode.initialCode.header +
                "\npublic class Main {\n" +
                data.inputCode +
                "\n" +
                languageCode.initialCode.main +
                "\n}";

        } else {
            code =
                languageCode.initialCode.header +
                "\n" +
                data.inputCode +
                "\n" +
                languageCode.initialCode.main;
        }


        
        const Batch = totalTestCases.map(({input, output})=>{
            return{
                source_code: code,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }
        })

        const result = await submitBatch(Batch);

        const tokenArray = result.map((obj)=>{
            return obj.token;
        })
        const tokenString = tokenArray.join(",")
        const batchResult = await getBatchResult(tokenString);


        let testPassed = 0;
        let status = "accepted";
        let runtime = 0;
        let memory = 0;
        let errorMessage = null;

        for(let batch of batchResult)
        {
            if(batch.status_id == 3)
            {
                testPassed++;
                runtime = runtime + parseFloat(batch.time);
                memory = Math.max(memory, batch.memory);
            }
            else{
                status = "wrong";
                errorMessage = batch.stderr || batch.compile_output;
            }
        }

        submission.status = status;
        submission.passedCases = testPassed;
        submission.memory = memory;
        submission.runtime = runtime;
        submission.error = errorMessage ? errorMessage : "null"

        await submission.save();

        // Adding the solved problem's problem id to the user
        if(status === "accepted" && !req.result.problemSolved.includes(data.problemId))
        {
            req.result.problemSolved.push(data.problemId);
            await req.result.save();
        }

        // Transform response
        const response = {
            submissionId: submission._id,
            status: status,
            passedCases: testPassed,
            totalCases: totalTestCases.length,
            message: status === "accepted" 
                ? "🎉 All test cases passed! Submission accepted." 
                : `${testPassed}/${totalTestCases.length} test cases passed.`,
            runtime: runtime.toFixed(3),
            memory: memory,
            error: errorMessage,
            language: data.language
        };

        res.status(201).json(response);

    }catch(err){
        res.status(500).send("Internal Server : "+ err.message);
    }
}


module.exports = {submit, run}