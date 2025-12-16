const express = require('express');
const { body, validationResult } = require('express-validator');
const { Tweet, User, Like } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   POST /api/tweets
// @desc    Create a tweet
// @access  Private
router.post('/', auth, [
  body('content').isLength({ min: 1, max: 280 }).withMessage('Tweet must be between 1 and 280 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, parentTweetId } = req.body;

    const tweet = await Tweet.create({
      content,
      userId: req.user.id,
      parentTweetId: parentTweetId || null
    });

    // Update user's tweet count
    await User.increment('tweetsCount', { where: { id: req.user.id } });

    // If it's a reply, update parent tweet's reply count
    if (parentTweetId) {
      await Tweet.increment('repliesCount', { where: { id: parentTweetId } });
    }

    const newTweet = await Tweet.findByPk(tweet.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
        }
      ]
    });

    res.status(201).json(newTweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tweets
// @desc    Get all tweets (timeline)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const tweets = await Tweet.findAll({
      where: {
        parentTweetId: null // Only get main tweets, not replies
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Add isLiked field for current user
    const tweetsWithLikeStatus = tweets.map(tweet => {
      const tweetData = tweet.toJSON();
      tweetData.isLiked = tweet.likes.some(like => like.userId === req.user.id);
      return tweetData;
    });

    res.json(tweetsWithLikeStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tweets/search
// @desc    Search tweets
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const tweets = await Tweet.findAll({
      where: {
        content: {
          [Op.like]: `%${q}%`
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Add isLiked field for current user
    const tweetsWithLikeStatus = tweets.map(tweet => {
      const tweetData = tweet.toJSON();
      tweetData.isLiked = tweet.likes.some(like => like.userId === req.user.id);
      return tweetData;
    });

    res.json(tweetsWithLikeStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tweets/:id
// @desc    Get tweet by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: Tweet,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    const tweetData = tweet.toJSON();
    tweetData.isLiked = tweet.likes.some(like => like.userId === req.user.id);

    res.json(tweetData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tweets/:id
// @desc    Delete a tweet
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByPk(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    if (tweet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this tweet' });
    }

    await tweet.destroy();

    // Update user's tweet count
    await User.decrement('tweetsCount', { where: { id: req.user.id } });

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tweets/user/:userId
// @desc    Get tweets by user ID
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const tweets = await Tweet.findAll({
      where: {
        userId: req.params.userId,
        parentTweetId: null // Only get main tweets, not replies
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'fullName', 'profileImageUrl', 'isVerified']
        },
        {
          model: Like,
          as: 'likes',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Add isLiked field for current user
    const tweetsWithLikeStatus = tweets.map(tweet => {
      const tweetData = tweet.toJSON();
      tweetData.isLiked = tweet.likes.some(like => like.userId === req.user.id);
      return tweetData;
    });

    res.json(tweetsWithLikeStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;