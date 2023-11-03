const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserInfo);
router.post('/', userController.createUserInfo);
router.get('/all/:userId', userController.getAllUsersExceptId);
router.post('/friendRequest', userController.sendFriendRequest);
router.get('/friend-request/:userId', userController.getFriendRequestById);
router.post('/friend-request/accept', userController.acceptLinkRequest);
router.get('/accepted-friends/:userId', userController.getFriendById);
// // ----post image-------- thiếu
// router.post('/messages', userController.getFriendRequestById);
// router.get('/messages/:senderId/:recepientId', userController.getFriendRequestById);
// router.post('/deleteMessages', userController.getFriendRequestById);
// router.get('/friend-requests/sent/:userId', userController.getFriendRequestById);
// router.get('/friends/:userId', userController.getFriendRequestById);

module.exports = router;
