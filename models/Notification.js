const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tweetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tweets',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('LIKE', 'FOLLOW', 'RETWEET', 'REPLY'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;