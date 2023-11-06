const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/', conversationController.createConversationRoom)
router.get('/:userId', conversationController.getAllConversations)

module.exports = router;