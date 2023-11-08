const messageService = require('../services/messageService');

exports.createMessage = async (req, res) => {
    try {
        const conversationId = req.body.conversationId;
        const senderId = req.body.senderId;
        const messageType = req.body.messageType;
        const message = req.body.message;
        const timestamp = req.body.timestamp;
        await messageService.createMessage(conversationId, senderId, messageType, message, timestamp);
        res.status(200).json({ message: "Send message successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}