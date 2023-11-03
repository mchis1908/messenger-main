const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUserInfo);
router.post('/', userController.createUserInfo);
router.get('/all/:userId', userController.getAllUsersExceptId);
router.post('/friendRequest', userController.sendFriendRequest);

module.exports = router;
