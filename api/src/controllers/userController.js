const userService = require('../services/userService');

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userInfo = await userService.getUserInfo(userId);
    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUserInfo = async (req, res) => {
  try {
    const data = req.body;
    const userId = await userService.createUserInfo(data);
    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getAllUsersExceptId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await userService.getAllUsersExceptId(userId);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.sendFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId;
    const selectedUserId = req.body.selectedUserId;
    await userService.sendFriendRequest(currentUserId, selectedUserId);
    res.status(200)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}