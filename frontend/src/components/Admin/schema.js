import {z} from "zod";




const testCaseSchema = z.object({
    input: z.string().min(1, "Input required"),
    output: z.string().min(1, "Minimum one output should be there"),
    explaination: z.string().min(30, "Minimum 30 words should be there in the explaination")
});


const initialCode = z.object({
    header: z.string(),
    function: z.string().min(10, "Minimum 10 characters are required for the function"),
    main: z.string()
})

const startCodeSchema = z.object({
    language: z.enum(["c++","java", "javascript"]),
    initialCode: initialCode
})
 
 
const referenceSolutionSchema = z.object({
    language: z.enum(["c++","java", "javascript"]),
    completeCode : z.string().min(1, "code required")
})
 
 
 
 const formSchema = z.object({
    title: z.string().min(3, "Title for the problem must be atleast 3 characters"),
    description: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.enum(["array", "linkedList", "dp", "graph", "stack", "queue", "string"]),
    visibleTestCases: z.array(testCaseSchema).min(1),
    hiddenTestCases: z.array(testCaseSchema).min(1),
    startCode: z.array(startCodeSchema).min(1,"Atleast 1 startcode is required"),
    referenceSolution: z.array(referenceSolutionSchema).min(1)
  })  


export default formSchema