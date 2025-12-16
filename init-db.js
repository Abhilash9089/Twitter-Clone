const sequelize = require('./config/database');
const { User, Tweet, Like, Follow, Notification } = require('./models');

const initDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force: true }); // Use force: true to recreate tables
    console.log('All models were synchronized successfully.');

    // Create sample data
    const user1 = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      fullName: 'John Doe',
      bio: 'Software developer and tech enthusiast 💻'
    });

    const user2 = await User.create({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: 'password123',
      fullName: 'Jane Smith',
      bio: 'Designer and creative thinker 🎨'
    });

    const user3 = await User.create({
      username: 'alex_dev',
      email: 'alex@example.com',
      password: 'password123',
      fullName: 'Alex Rodriguez',
      bio: 'Full-stack developer | React & Node.js enthusiast 🚀'
    });

    const user4 = await User.create({
      username: 'sarah_ui',
      email: 'sarah@example.com',
      password: 'password123',
      fullName: 'Sarah Johnson',
      bio: 'UI/UX Designer | Making the web beautiful ✨'
    });

    const user5 = await User.create({
      username: 'mike_tech',
      email: 'mike@example.com',
      password: 'password123',
      fullName: 'Mike Chen',
      bio: 'Tech entrepreneur | Building the future 🌟'
    });

    // Create sample tweets
    const tweet1 = await Tweet.create({
      content: 'Hello Twitter! This is my first tweet 🎉',
      userId: user1.id
    });

    const tweet2 = await Tweet.create({
      content: 'Beautiful sunset today! Nature never fails to amaze me 🌅',
      userId: user2.id
    });

    const tweet3 = await Tweet.create({
      content: 'Working on an exciting new project. Can\'t wait to share it with everyone!',
      userId: user1.id
    });

    const tweet4 = await Tweet.create({
      content: 'Just deployed my new React app! The feeling of seeing your code come to life is amazing 🚀 #ReactJS #WebDevelopment',
      userId: user3.id
    });

    const tweet5 = await Tweet.create({
      content: 'Design tip: Always think about the user first. Great UX is invisible - users should never have to think about how to use your product 💡',
      userId: user4.id
    });

    const tweet6 = await Tweet.create({
      content: 'The future of web development is exciting! AI, WebAssembly, and edge computing are changing everything 🌐 #TechNews',
      userId: user5.id
    });

    const tweet7 = await Tweet.create({
      content: 'Coffee ☕ + Code 💻 = Perfect morning! What\'s your favorite coding setup?',
      userId: user3.id
    });

    const tweet8 = await Tweet.create({
      content: 'Just finished reading about the latest JavaScript features. ES2024 is going to be amazing! #JavaScript #Programming',
      userId: user1.id
    });

    // Create sample likes
    const likes = [
      { userId: user2.id, tweetId: tweet1.id },
      { userId: user1.id, tweetId: tweet2.id },
      { userId: user3.id, tweetId: tweet1.id },
      { userId: user4.id, tweetId: tweet4.id },
      { userId: user5.id, tweetId: tweet4.id },
      { userId: user1.id, tweetId: tweet5.id },
      { userId: user2.id, tweetId: tweet5.id },
      { userId: user3.id, tweetId: tweet6.id },
      { userId: user4.id, tweetId: tweet7.id },
      { userId: user5.id, tweetId: tweet8.id }
    ];

    for (const like of likes) {
      await Like.create(like);
      await Tweet.increment('likesCount', { where: { id: like.tweetId } });
    }

    // Create sample follow relationships
    const follows = [
      { followerId: user1.id, followingId: user2.id },
      { followerId: user1.id, followingId: user3.id },
      { followerId: user2.id, followingId: user1.id },
      { followerId: user2.id, followingId: user4.id },
      { followerId: user3.id, followingId: user1.id },
      { followerId: user3.id, followingId: user5.id },
      { followerId: user4.id, followingId: user2.id },
      { followerId: user5.id, followingId: user3.id }
    ];

    for (const follow of follows) {
      await Follow.create(follow);
      await User.increment('followingCount', { where: { id: follow.followerId } });
      await User.increment('followersCount', { where: { id: follow.followingId } });
    }

    // Update tweet counts
    await User.update({ tweetsCount: 3 }, { where: { id: user1.id } });
    await User.update({ tweetsCount: 1 }, { where: { id: user2.id } });
    await User.update({ tweetsCount: 2 }, { where: { id: user3.id } });
    await User.update({ tweetsCount: 1 }, { where: { id: user4.id } });
    await User.update({ tweetsCount: 1 }, { where: { id: user5.id } });

    console.log('Sample data created successfully!');
    console.log('You can now login with any of these accounts:');
    console.log('Username: john_doe, Password: password123');
    console.log('Username: jane_smith, Password: password123');
    console.log('Username: alex_dev, Password: password123');
    console.log('Username: sarah_ui, Password: password123');
    console.log('Username: mike_tech, Password: password123');

  } catch (error) {
    console.error('Unable to initialize database:', error);
  } finally {
    await sequelize.close();
  }
};

initDatabase();