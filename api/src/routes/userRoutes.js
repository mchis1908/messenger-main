const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserInfo);
router.post('/', userController.createUserInfo);
router.get('/all/:userId', userController.getAllUsersExceptId);
router.post('/friend-request', userController.sendFriendRequest);
router.get('/friend-request/:userId', userController.getFriendsRequestById);
router.post('/friend-request/accept', userController.acceptLinkRequest);
router.get('/accepted-friends/:userId', userController.getFriendsById);
// // ----post image-------- thiếu
// router.post('/messages', userController.createMessage);
// router.get('/messages/:senderId/:recepientId', userController.getFriendsRequestById);
// router.post('/deleteMessages', userController.getFriendsRequestById);
router.get('/friend-requests/sent/:userId', userController.getSendFriendRequestById);
router.get('/friends/:userId', userController.getListIdFriends);

module.exports = router;
