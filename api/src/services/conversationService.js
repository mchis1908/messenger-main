const { Filter } = require('firebase-admin/firestore');
const { db } = require('../config/firebase');
const { getUserInfo } = require('./userService');

exports.createConversationRoom = async (user1Id, user2Id) => {
    try {
        const user1 = await getUserInfo(user1Id);
        getUserInfo(user2Id).then(async (user) => {
            const conversationRef = await db.collection('conversations').add({
                participant_1: user1,
                participant_2: user,
                lastMessage: {
                    senderId: "",
                    messageType: "",
                    message: "",
                    timestamp: "",
                },
            })
            return conversationRef.id;
        })
    } catch (error) {
      throw error;
    }
}

exports.getAllConversations = async (userId) => {
    try {
        const conversationRef = db.collection('conversations').where(Filter.or(Filter.where('participant_1.id', '==', userId), Filter.where('participant_2.id', '==', userId)));
        const conversationDocs = await conversationRef.get();
        const conversations = [];
        conversationDocs.forEach((doc) => {
            const conversationData = doc.data();
            conversations.push({
                id: doc.id,
                ...conversationData,  
            });
        });
        return conversations;
    } catch (error) {
        console.log(error)
        throw error;
    }
}