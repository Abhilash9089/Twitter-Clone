import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TweetComposer = ({ onTweetCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/tweets', { content });
      onTweetCreated(response.data);
      setContent('');
    } catch (error) {
      console.error('Error creating tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 280 - content.length;

  return (
    <div className="tweet-composer">
      <div style={{ display: 'flex', gap: '12px' }}>
        <img
          src={user?.profileImageUrl || 'https://via.placeholder.com/50'}
          alt="Your avatar"
          className="tweet-avatar"
          style={{ width: '50px', height: '50px' }}
        />
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
          />
          <div className="tweet-actions">
            <div className={`char-count ${remainingChars < 20 ? 'warning' : ''} ${remainingChars < 0 ? 'danger' : ''}`}>
              {remainingChars}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!content.trim() || remainingChars < 0 || loading}
            >
              {loading ? 'Tweeting...' : 'Tweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetComposer;