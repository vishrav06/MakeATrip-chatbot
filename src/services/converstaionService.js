const {v4:uuidv4} = require('uuid');

const conversations = new Map();

const MAX_MESSAGES = parseInt(process.env.MAX_CONVERSATION_HISTORY) || 10; 

const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT_MS) || 3600000;



function createSession(){
    const sessionId = uuidv4();
    
    conversations.set(sessionId, {
        sessionId,
        messages: [],
        nonTravelWarnings: 0,
        active: true,
        createdAt: new Date(),
        lastActivityAt: new Date()
    });
    return sessionId;
}


function getSession(sessionId){
    return conversations.get(sessionId);
}

function sessionExists(sessionId) {
    return conversations.has(sessionId);
}

function addMessage(sessionId, role, content){

    const session = conversations.get(sessionId);
    if(!session) return false;

    session.messages.push({
        role,
        content,
        timestamp: new Date()
    })

    if(session.messages.length > MAX_MESSAGES){
        session.messages = session.messages.slice(-MAX_MESSAGES);
    
    }

    session.lastActivityAt = new Date();
    return true;
}


function getMessagesForOpenAI(sessionId){
    const session = conversations.get(sessionId);
    if(!session) return [];

    return session.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }))

}


function incrementWarnings(sessionId) {
    const session = conversations.get(sessionId);
    if (session) {
        session.nonTravelWarnings++;
        return session.nonTravelWarnings;
    }
    return 0;
}

function resetWarnings(sessionId) {
    const session = conversations.get(sessionId);
    if (session) {
      session.nonTravelWarnings = 0;
    }
}


function closeSession(sessionId) {
    const session = conversations.get(sessionId);
    if (session) {
      session.active = false;
    }
}


function deleteSession(sessionId) {
    return conversations.delete(sessionId);
}

function cleanupExpiredSessions() {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of conversations.entries()) {
        if (now - session.lastActivityAt.getTime() > SESSION_TIMEOUT) {
            conversations.delete(sessionId);
            cleaned++;
        }
    }

    return cleaned;
  }

  setInterval(cleanupExpiredSessions, 60000);

  module.exports = {
    createSession,
    getSession,
    addMessage,
    getMessagesForOpenAI,
    sessionExists,
    incrementWarnings,
    resetWarnings,
    closeSession,
    deleteSession,
    cleanupExpiredSessions
  }

