function validateProblem(problem)
{
    const errors = []
    // Validation for title
    if(!problem.title)
    {
        throw new Error("Title of the problem is missing");
    }
    
    if(!problem.description)
    {
        throw new Error("Description of the problem is missing");
    }

    if(!problem.tags)
    {
        throw new Error("Tags for the problems are missing");
    }
    
    if(!problem.visibleTestCases)
    {
        throw new Error("Visible Test Cases for the problems are missing");
    }
    problem.visibleTestCases.forEach((p)=>{

        if(!p.input || !p.output || !p.explaination)
        {
            throw new Error("One of the field of visible test cases is missing");
        }
   
    })

    
    if(!problem.hiddenTestCases)
    {
        throw new Error("Visible Test Cases for the problems are missing");
    }
    
    problem.hiddenTestCases.forEach((p)=>{

        if(!p.input || !p.output || !p.explaination)
        {
            throw new Error("One of the field of hidden test cases is missing");
        }
   
    })

    if(!problem.startCode)
    {
        throw new Error("Start code for the problem is missing");
    }

    
    problem.startCode.forEach((p)=>{

       if(!p.language || !p.initialCode)
        {
        throw new Error("one of the fields for startCode solution is missing")
        }
   
    })
    if(!problem.referenceSolution)
    {
        throw new Error("Reference solution for the problem is missing");
    }
    problem.referenceSolution.forEach((p)=>{

       if(!p.language || !p.completeCode)
        {
        throw new Error("one of the fields for reference solution is missing")
        }
   
    })

}

module.exports = validateProblem;