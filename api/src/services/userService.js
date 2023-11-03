const { db } = require("../config/firebase")

exports.getUserInfo = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    return userDoc.data();
  } catch (error) {
    throw error;
  }
};

exports.createUserInfo = async (data) => {
  try {
    const userRef = await db.collection('users').doc(data.id).set(data);

    return userRef.id;
  } catch (error) {
    throw error;
  }
}

exports.getAllUsersExceptId = async (userId) => {
  try {
    const userRef = db.collection('users').where('id', '!=', userId);
    const userDocs = await userRef.get();
    
    const users = [];
    userDocs.forEach((doc) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    throw error;
  }
}

exports.sendFriendRequest = async (currentUserId, selectedUserId) => {
  try {
    // Get the current user's document
    const userRef = db.collection('users').doc(currentUserId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    // Update the friendRequests array
    const currentUserData = userDoc.data();
    const updatedFriendRequests = [...currentUserData.friendRequests, selectedUserId];

    // Set the updated data back to the document
    await userRef.update({
      friendRequests: updatedFriendRequests
    });

    // Return the document ID
    return currentUserId;
  } catch (error) {
    throw error;
  }
}

