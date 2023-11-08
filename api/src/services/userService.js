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
    console.log(error)
    throw error;
  }
}

exports.sendFriendRequest = async (currentUserId, selectedUserId) => {
  try {
    const userRef = db.collection('users').doc(currentUserId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const currentUserData = userDoc.data();
    const updatedFriendRequests = [...currentUserData.sentFriendRequests, selectedUserId];

    await userRef.update({
      sentFriendRequests: updatedFriendRequests
    });

    const selectedUserRef = db.collection('users').doc(selectedUserId);
    const selectedUserDoc = await selectedUserRef.get();

    if (!selectedUserDoc.exists) {
      throw new Error('Selected user not found');
    }

    const selectedUserData = selectedUserDoc.data();
    const updatedSentFriendRequests = [...selectedUserData.friendRequests, currentUserId];

    await selectedUserRef.update({
      friendRequests: updatedSentFriendRequests
    });

    return updatedFriendRequests;
  } catch (error) {
    throw error;
  }
}

exports.getFriendsRequestById = async (userId) => {
  try {
    // Fetch the user document based on the User id
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = userDoc.data();
    const friendRequests = userData.friendRequests || [];

    // Search for users whose IDs are in the friendRequests array
    const userPromises = friendRequests.map(async (friendId) => {
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();

      if (friendDoc.exists) {
        return friendDoc.data();
      }
    });

    const friendsData = await Promise.all(userPromises);

    return friendsData;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.acceptLinkRequest = async (senderId, recipientId ) => {
  try {
    const senderRef = db.collection('users').doc(senderId);
    const recipientRef = db.collection('users').doc(recipientId);

    const senderDoc = await senderRef.get();
    const recipientDoc = await recipientRef.get();

    if (!senderDoc.exists || !recipientDoc.exists) {
      res.status(404).json({ message: "Sender or recipient not found" });
      return;
    }

    const senderData = senderDoc.data();
    const recipientData = recipientDoc.data();

    senderData.friends.push(recipientId);
    recipientData.friends.push(senderId);

    recipientData.friendRequests = recipientData.friendRequests.filter(
      (request) => request !== senderId
    );

    senderData.sentFriendRequests = senderData.sentFriendRequests.filter(
      (request) => request !== recipientId
    );

    await senderRef.set(senderData);
    await recipientRef.set(recipientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getFriendsById = async (userId) => {
  try {
    // Fetch the user document based on the User id
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const friendIds = userData.friends; // Assuming "friends" is an array of user IDs

    if (!friendIds || friendIds.length === 0) {
      return []; // No friends to fetch
    }

    const friendPromises = friendIds.map(async (friendId) => {
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();

      if (friendDoc.exists) {
        return friendDoc.data();
      }
    });

    const friendsData = await Promise.all(friendPromises);

    return friendsData;
  } catch (error) {
    throw error;
  }
}

exports.getSendFriendRequestById = async (userId) => {
  try {
    // Fetch the user document based on the User id
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = userDoc.data();
    const sentFriendRequests = userData.sentFriendRequests || [];

    // Search for users whose IDs are in the sentFriendRequests array
    const userPromises = sentFriendRequests.map(async (friendId) => {
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();

      if (friendDoc.exists) {
        return friendDoc.data();
      }
    });

    const friendsData = await Promise.all(userPromises);

    return friendsData;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getListIdFriends = async (userId) => {
  try {
    // Fetch the user document based on the User id
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const friendIds = userData.friends || [];

    return friendIds;
  } catch (error) {
    throw error;
  }
}
