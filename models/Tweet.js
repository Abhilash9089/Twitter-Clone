const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tweet = sequelize.define('Tweet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 280]
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  retweetsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  repliesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  parentTweetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tweets',
      key: 'id'
    }
  },
  isRetweet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  originalTweetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tweets',
      key: 'id'
    }
  }
}, {
  tableName: 'tweets',
  timestamps: true
});

module.exports = Tweet;