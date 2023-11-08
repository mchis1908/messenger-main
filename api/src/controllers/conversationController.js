const conversationService = require('../services/conversationService');

exports.createConversationRoom = async (req, res) => {
    try {
      const user1Id = req.body.user1Id;
      const user2Id = req.body.user2Id;
      const conversationRoomId = await conversationService.createConversationRoom(user1Id, user2Id);
      res.status(200).json({ conversationRoomId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
}
  
exports.getAllConversations = async (req, res) => {
    try {
      const userId = req.params.userId;
      const conversations = await conversationService.getAllConversations(userId);
      res.status(200).json({conversations});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
}