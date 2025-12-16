const User = require('./User');
const Tweet = require('./Tweet');
const Like = require('./Like');
const Follow = require('./Follow');
const Notification = require('./Notification');

// User associations
User.hasMany(Tweet, { foreignKey: 'userId', as: 'tweets' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Notification, { foreignKey: 'fromUserId', as: 'sentNotifications' });

// Tweet associations
Tweet.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Tweet.hasMany(Like, { foreignKey: 'tweetId', as: 'likes' });
Tweet.hasMany(Tweet, { foreignKey: 'parentTweetId', as: 'replies' });
Tweet.belongsTo(Tweet, { foreignKey: 'parentTweetId', as: 'parentTweet' });
Tweet.belongsTo(Tweet, { foreignKey: 'originalTweetId', as: 'originalTweet' });
Tweet.hasMany(Notification, { foreignKey: 'tweetId', as: 'notifications' });

// Like associations
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId', as: 'tweet' });

// Follow associations
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });
Notification.belongsTo(Tweet, { foreignKey: 'tweetId', as: 'tweet' });

module.exports = {
  User,
  Tweet,
  Like,
  Follow,
  Notification
};