const { rtdb, db } = require('../config/firebase');

exports.createMessage = async (conversationId, senderId, messageType, message, timestamp, replyFor, replyType) => {
    try {
        const messageRef = rtdb.ref(`messages/${conversationId}/${timestamp}`);
        messageRef.set({
            senderId: senderId,
            messageType: messageType,
            message: message,
            timestamp: timestamp,
            isRead: false,
            replyFor: replyFor,
            replyType: replyType,
        }).then(() => {
            db.collection('conversations').doc(conversationId).update({
                lastMessage: {
                    senderId: senderId,
                    messageType: messageType,
                    message: message,
                    timestamp: timestamp,
                },
            })
        })
        return messageRef.id;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.deleteMessage = async(conversationId, timestamp) => {
    try {
        const messageRef = rtdb.ref(`messages/${conversationId}/${timestamp}`);
        messageRef.remove();
    } catch (error) {
        console.log("Something went wrong delete message", error);
    }
}