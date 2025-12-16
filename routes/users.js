const express = require('express');
const { User, Tweet, Follow } = require('../models');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users
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

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { fullName: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
      limit,
      offset
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Tweet,
          as: 'tweets',
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user is following this user
    const isFollowing = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: user.id
      }
    });

    const userData = user.toJSON();
    userData.isFollowing = !!isFollowing;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/me/avatar
// @desc    Upload profile picture
// @access  Private
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    
    // Update profile image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    user.profileImageUrl = imageUrl;
    await user.save();

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profile picture updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const { fullName, bio, location, website } = req.body;

    const user = await User.findByPk(req.user.id);
    
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    await user.save();

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const userToFollow = await User.findByPk(req.params.id);
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Create follow relationship
    await Follow.create({
      followerId: req.user.id,
      followingId: req.params.id
    });

    // Update counts
    await User.increment('followingCount', { where: { id: req.user.id } });
    await User.increment('followersCount', { where: { id: req.params.id } });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id/follow
// @desc    Unfollow a user
// @access  Private
router.delete('/:id/follow', auth, async (req, res) => {
  try {
    const follow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.id
      }
    });

    if (!follow) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    await follow.destroy();

    // Update counts
    await User.decrement('followingCount', { where: { id: req.user.id } });
    await User.decrement('followersCount', { where: { id: req.params.id } });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;