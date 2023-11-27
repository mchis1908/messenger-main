import OpenAI from "openai";
const openai = new OpenAI();

export const apiCall = async (prompt, messages, feature)=>{
    if(feature==='dalle'){
        console.log('dalle api call');
        return dalleApiCall(prompt, messages)
    }else
    {
        console.log('chatgpt api call')
        return chatgptApiCall(prompt, messages);
    }
}

const chatgptApiCall = async (prompt, messages)=>{
    try{
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "gpt-3.5-turbo",
        });
        
        console.log(completion.choices[0]);
        let answer = res.data?.choices[0]?.message?.content;
        messages.push({role: 'assistant', content: answer.trim()});
        return Promise.resolve({success: true, data: messages}); 
    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

const dalleApiCall = async (prompt, messages)=>{
    try{
        const image = await openai.images.generate({ prompt: "A cute baby sea otter" });
        console.log(image.data);
        let url = res?.data?.data[0]?.url;
        messages.push({role: 'assistant', content: url});
        return Promise.resolve({success: true, data: messages});
    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}