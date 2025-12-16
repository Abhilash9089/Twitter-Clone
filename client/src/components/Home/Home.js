import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Layout/Sidebar';
import TweetComposer from '../Tweet/TweetComposer';
import TweetList from '../Tweet/TweetList';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      console.log('Fetching tweets...');
      const response = await axios.get('/api/tweets');
      console.log('Tweets fetched:', response.data);
      setTweets(response.data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTweet = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      console.log('Attempting to like tweet:', tweetId);
      const tweet = tweets.find(t => t.id === tweetId);
      console.log('Found tweet:', tweet);
      
      if (tweet.isLiked) {
        console.log('Unliking tweet...');
        await axios.delete(`/api/likes/${tweetId}`);
      } else {
        console.log('Liking tweet...');
        await axios.post(`/api/likes/${tweetId}`);
      }
      
      console.log('Like operation successful');
      
      // Update local state
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
      console.error('Error details:', error.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <div style={{ borderBottom: '1px solid #2f3336', padding: '16px 20px' }}>
          <h2>Home</h2>
        </div>
        <TweetComposer onTweetCreated={handleNewTweet} />
        <TweetList tweets={tweets} onLike={handleLikeTweet} />
      </div>
    </div>
  );
};

export default Home;