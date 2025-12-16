import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Layout/Sidebar';
import TweetList from '../Tweet/TweetList';
import { useAuth } from '../../context/AuthContext';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const trendingTopics = [
    { topic: '#ReactJS', tweets: '125K Tweets' },
    { topic: '#JavaScript', tweets: '89K Tweets' },
    { topic: '#WebDevelopment', tweets: '67K Tweets' },
    { topic: '#NodeJS', tweets: '45K Tweets' },
    { topic: '#Programming', tweets: '234K Tweets' },
    { topic: '#TechNews', tweets: '156K Tweets' }
  ];

  useEffect(() => {
    if (activeTab === 'trending') {
      fetchPopularTweets();
    }
  }, [activeTab]);

  const fetchPopularTweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tweets');
      // Sort by likes count to show popular tweets
      const sortedTweets = response.data.sort((a, b) => b.likesCount - a.likesCount);
      setTweets(sortedTweets.slice(0, 10)); // Show top 10
    } catch (error) {
      console.error('Error fetching popular tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      if (activeTab === 'tweets') {
        const response = await axios.get(`/api/tweets/search?q=${encodeURIComponent(searchQuery)}`);
        setTweets(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      const tweet = tweets.find(t => t.id === tweetId);
      if (tweet.isLiked) {
        await axios.delete(`/api/likes/${tweetId}`);
      } else {
        await axios.post(`/api/likes/${tweetId}`);
      }
      
      setTweets(tweets.map(t => 
        t.id === tweetId 
          ? { 
              ...t, 
              isLiked: !t.isLiked,
              likesCount: t.isLiked ? t.likesCount - 1 : t.likesCount + 1
            }
          : t
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (userToUpdate.isFollowing) {
        await axios.delete(`/api/users/${userId}/follow`);
      } else {
        await axios.post(`/api/users/${userId}/follow`);
      }
      
      setUsers(users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isFollowing: !u.isFollowing,
              followersCount: u.isFollowing ? u.followersCount - 1 : u.followersCount + 1
            }
          : u
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <div style={{ borderBottom: '1px solid #2f3336', padding: '16px 20px' }}>
          <h2>Explore</h2>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2f3336' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search Twitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#16181c',
                border: '1px solid #2f3336',
                borderRadius: '24px',
                color: '#fff',
                fontSize: '15px'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '24px' }}>
              Search
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #2f3336' }}>
          {['trending', 'tweets', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === tab ? '#1d9bf0' : '#71767b',
                borderBottom: activeTab === tab ? '2px solid #1d9bf0' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === 'trending' && (
              <div>
                {/* Trending Topics */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '16px', color: '#fff' }}>Trending Topics</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {trendingTopics.map((trend, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                      >
                        <div style={{ fontWeight: 'bold', color: '#1d9bf0' }}>{trend.topic}</div>
                        <div style={{ color: '#71767b', fontSize: '14px' }}>{trend.tweets}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Tweets */}
                <div style={{ borderTop: '1px solid #2f3336' }}>
                  <div style={{ padding: '20px 20px 0' }}>
                    <h3 style={{ marginBottom: '16px', color: '#fff' }}>Popular Tweets</h3>
                  </div>
                  <TweetList tweets={tweets} onLike={handleLikeTweet} />
                </div>
              </div>
            )}

            {activeTab === 'tweets' && (
              <div>
                {tweets.length > 0 ? (
                  <TweetList tweets={tweets} onLike={handleLikeTweet} />
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#71767b' }}>
                    <h3>Search for tweets</h3>
                    <p>Enter a search term to find tweets</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                {users.length > 0 ? (
                  <div>
                    {users.map((userItem) => (
                      <div
                        key={userItem.id}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid #2f3336',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <img
                          src={userItem.profileImageUrl || 'https://via.placeholder.com/50'}
                          alt={userItem.fullName}
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', color: '#fff' }}>
                            {userItem.fullName}
                            {userItem.isVerified && <span style={{ color: '#1d9bf0', marginLeft: '4px' }}>✓</span>}
                          </div>
                          <div style={{ color: '#71767b' }}>@{userItem.username}</div>
                          {userItem.bio && (
                            <div style={{ color: '#fff', marginTop: '4px', fontSize: '14px' }}>
                              {userItem.bio}
                            </div>
                          )}
                          <div style={{ color: '#71767b', fontSize: '14px', marginTop: '4px' }}>
                            {userItem.followersCount} followers
                          </div>
                        </div>
                        {user.id !== userItem.id && (
                          <button
                            onClick={() => handleFollowUser(userItem.id)}
                            className={`btn ${userItem.isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ borderRadius: '20px' }}
                          >
                            {userItem.isFollowing ? 'Unfollow' : 'Follow'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#71767b' }}>
                    <h3>Search for people</h3>
                    <p>Enter a search term to find users</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;