const openai = require('../config/openai')

const SYSTEM_PROMPT = `
You are a helpful travel assistant for MakeATrip, a travel booking platform.   
    Your role is to:

    1. Provide accurate and helpful travel information, recommendations, and advice
    2. Answer questions about destinations, hotels, flights, attractions, travel tips, transportation,    
    restaurants, local customs, weather for travel planning, visas, packing, budgeting for trips, and     
    activities
    3. Be friendly, enthusiastic, and helpful about all travel-related topics

    IMPORTANT RULES:
    - You can ONLY answer travel-related questions
    - If a user asks a non-travel question, politely inform them that you can only help with
    travel-related queries
    - Travel-related topics include: destinations, accommodations, flights, attractions, travel tips,     
    packing, visas, weather (for travel planning), local customs and culture, food and restaurants,       
    transportation, activities, budgeting for trips, safety tips, and travel itineraries
    - Non-travel topics include: general knowledge, mathematics, coding/programming, recipes (unless      
    travel food-related), medical advice, politics, sports scores, financial advice, etc.

    Keep your responses concise, helpful, and focused on travel.
`

async function getChatResponse(messages){
    try{
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500
        })

        return response.choices[0].message.content;
    }
    catch(error){
        console.error('OpenAI API Error: ', error);
        throw error;
    }
}

async function classifyTravelQuery(message){
    try{
        const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Determine if the following query is related to travel, tourism, destinations, hotels, flights, or vacation planning. Answer only "yes" or "no".'
            },
            {
                role: 'user',
                content: message
            }
            ],
            temperature: 0,
            max_tokens: 5
        });

        const answer = response.choices[0].message.content.toLowerCase().trim();
        return answer.includes('yes');
    }
    catch(error){
        console.error('OpenAI Classification Error: ', error);
        return true;
    }
}


module.exports = {
    getChatResponse,
    classifyTravelQuery
};