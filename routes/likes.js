const express = require('express');
const { Like, Tweet, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/likes/:tweetId
// @desc    Like a tweet
// @access  Private
router.post('/:tweetId', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findByPk(req.params.tweetId);
    
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.tweetId
      }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Tweet already liked' });
    }

    // Create like
    await Like.create({
      userId: req.user.id,
      tweetId: req.params.tweetId
    });

    // Update tweet likes count
    await Tweet.increment('likesCount', { where: { id: req.params.tweetId } });

    res.json({ message: 'Tweet liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/likes/:tweetId
// @desc    Unlike a tweet
// @access  Private
router.delete('/:tweetId', auth, async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.tweetId
      }
    });

    if (!like) {
      return res.status(400).json({ message: 'Tweet not liked yet' });
    }

    await like.destroy();

    // Update tweet likes count
    await Tweet.decrement('likesCount', { where: { id: req.params.tweetId } });

    res.json({ message: 'Tweet unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;