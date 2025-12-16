const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
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
  tweetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tweets',
      key: 'id'
    }
  }
}, {
  tableName: 'likes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'tweetId']
    }
  ]
});

module.exports = Like;