import axiosClient from "../axiosClient";

async function getProblem({pid, language}) {
      try
      {
        const p = await axiosClient.get(`/problem/getProblem/${pid}`);

        const initialCode = p.data?.startCode?.find(c => c.language === language)?.initialCode || '';
        
        return  {
            data : p.data,
            initialCode
        }
      }
      catch(err)
      {
        console.log(err);
        alert("Error fetching the problem")
      }
    } 


async function getSubmittedProblem(pid){
        try{
            const p  = await axiosClient.get(`/problem/submittedProblem/${pid}`)
            return {data : p.data || []}
        }catch(err){
            return {data: []}
        }
 }


 export {getProblem, getSubmittedProblem}