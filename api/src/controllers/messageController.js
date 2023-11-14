const messageService = require('../services/messageService');

exports.createMessage = async (req, res) => {
    try {
        const conversationId = req.body.conversationId;
        const senderId = req.body.senderId;
        const messageType = req.body.messageType;
        const message = req.body.message;
        const timestamp = req.body.timestamp;
        const replyFor = req.body.replyFor ? req.body.replyFor : null;
        const replyType = req.body.replyType ? req.body.replyType : null;
        await messageService.createMessage(conversationId, senderId, messageType, message, timestamp, replyFor, replyType);
        res.status(200).json({ message: "Send message successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const conversationId = req.body.conversationId;
        const timestamp = req.body.timestamp;
        await messageService.deleteMessage(conversationId, timestamp);
        res.status(200).json({ message: "Delete message successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}