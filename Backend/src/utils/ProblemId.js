 const axios = require('axios');


function getLanguageId(language)
{
    const languageObj = {
        "c++" : 54,
        "javascript" : 63,
        "java" : 62
    } 

    return languageObj[language.toLowerCase()];
}


async function submitBatch(submissions)
{
    const options = {
      method: 'POST',
      url: `${process.env.JUDGE_BASE_URL}/submissions/batch`,
      params: {
        base64_encoded: 'false'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: {submissions}
    };
    
    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    
    return await fetchData();
   

}


async function getBatchResult(token)
{
    const options = {
      method: 'GET',
      url: `${process.env.JUDGE_BASE_URL}/submissions/batch`,
      params: {
        tokens: token,
        base64_encoded: 'false',
        fields: '*'
      },
      headers: {}
    };
    
    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
   
    while(true)
    {
        const result =  await fetchData();

        const isResultValid = result.submissions.every((r)=>r.status_id>2);

        if(isResultValid)
            return result.submissions;


        waiting(1000);
    }
    
}


// Timer for 1 second

const waiting = async (timer)=>{
    setTimeout(()=>{
        return 1;
    }, timer)
}

module.exports = {getLanguageId, submitBatch, getBatchResult}