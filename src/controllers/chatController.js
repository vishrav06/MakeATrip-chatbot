const conversationService = require('../services/conversationService');
const openaiService = require('../services/openaiService');
const { isLikelyTravelQuery } = require('../utils/travelValidator');


async function sendMessage(req, res, next){
    try{
        const {sessionId, message} = req.body;

        if(!message || message.trim().length === 0){
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            })
        }

        
        let currentSessionId = sessionId;

        let session = null;

        if(!currentSessionId || !conversationService.sessionExists(currentSessionId)){
            currentSessionId = conversationService.createSession();
            session = conversationService.getSession(currentSessionId);
        }
        else{
            session = conversationService.getSession(currentSessionId);
        }
        
        if(!session.active){
            return res.status(400).json({
                success: false,
                error: 'This conversation has been closed.',
                conversationActive: false
            })
        }


        const quickCheck = isLikelyTravelQuery(message);
        let isTravelRelated = quickCheck;

        if(quickCheck === null){
            isTravelRelated = await openaiService.classifyTravelQuery(message);
        }

        if(!isTravelRelated){
            const warnings = conversationService.incrementWarnings(currentSessionId);
            conversationService.addMessage(currentSessionId, 'user', message);

            let responseMessage;
            let shouldClose = false;

            if(warnings === 1){
                // first warning
                responseMessage = "I'm a travel assistant for MakeATrip and can only help with travel-related questions. Please ask me about destinations, hotels, flights, attractions, travel tips, or any other travel topics!";
            }
            else{
                responseMessage = "This conversation has been closed due to repeated non-travel queries. Thank you for your interest. Please start a new session if you have travel-related questions.";
                conversationService.closeSession(currentSessionId);
                shouldClose = true;
            }

            conversationService.addMessage(currentSessionId, 'assistant', responseMessage);

            return res.json({
                success: true,
                sessionId: currentSessionId,
                message: responseMessage,
                conversationActive: !shouldClose,
                warning: 'non_travel_query',
                messageCount: session.messages.length                
            })
        }


        conversationService.resetWarnings(currentSessionId); // Reset warning after valid message

        conversationService.addMessage(currentSessionId, 'user', message); // Add user message to conversation

        const conversationHistory = conversationService.getMessagesForOpenAI(currentSessionId); // Get conversation history for OpenAI

        const aiResponse = await openaiService.getChatResponse(conversationHistory); // Get response from openai

        conversationService.addMessage(currentSessionId, 'assistant', aiResponse);

        res.json({
            success: true,
            sessionId: currentSessionId,
            message: aiResponse,
            conversationActive: true,
            messageCount: session.messages.length
        });    


    }
    catch(error){
        next(error);
    }
}



function getHistory(req, res){
    const {sessionId} = req.params;

    if(!conversationService.sessionExists(sessionId)){
        return res.status(404).json({
            success: false,
            error: 'Session not found'
        })
    }

    const session = conversationService.getSession(sessionId);

    res.json({
        success: true,
        sessionId,
        history: session.messages,
        conversationActive: session.active,
        messageCount: session.messages.length
    })

}


function deleteSession(req, res){
    const {sessionId} = req.params;

    const deleted = conversationService.deleteSession(sessionId);

    if(deleted){
        res.json({
            success: true,
            message: 'Session deleted successfully'
        })
    }
    else{
        res.status(404).json({
            success: false,
            error: 'Session not found'
        })
    
    }
}


module.exports = {
    sendMessage,
    getHistory,
    deleteSession
}