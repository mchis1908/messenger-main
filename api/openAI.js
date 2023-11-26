import { OPENAI_API_KEY } from '@env'
import axios from 'axios';
const client = axios.create({
    headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json"
    }
})

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages, feature)=>{
    // try{
    //     const res = await client.post(chatgptUrl, {
    //         model: "gpt-3.5-turbo",
    //         messages: [{
    //             role: 'user',
    //             content: `Is the ${prompt} about creating a picture, image, or any visual art? Please respond with either 'Yes' or 'No'`
    //         }]
    //     });
    //     console.log(res);
    //     isArt = res.data?.choices[0]?.message?.content;
    //     isArt = isArt.trim();
    //     if(isArt.toLowerCase().includes('yes')){
    //         console.log('dalle api call');
    //         return dalleApiCall(prompt, messages)
    //     }else{
    //         console.log('chatgpt api call')
    //         return chatgptApiCall(prompt, messages);
    //     }

    // }catch(err){
    //     console.log('error: ',err);
    //     return Promise.resolve({success: false, msg: err.message});
    // }

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
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages
        })

        let answer = res.data?.choices[0]?.message?.content;
        messages.push({role: 'assistant', content: answer.trim()});
        // console.log('got chat response', answer);
        return Promise.resolve({success: true, data: messages}); 

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

const dalleApiCall = async (prompt, messages)=>{
    try{
        const res = await client.post(dalleUrl, {
            prompt,
            n: 1,
            size: "512x512"
        })

        let url = res?.data?.data[0]?.url;
        // console.log('got image url: ',url);
        messages.push({role: 'assistant', content: url});
        return Promise.resolve({success: true, data: messages});

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}