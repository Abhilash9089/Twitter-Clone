import React from 'react';
import { Link } from 'react-router-dom';

const Tweet = ({ tweet, onLike }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(tweet.id);
  };

  return (
    <div className="tweet">
      <div className="tweet-header">
        <Link to={`/profile/${tweet.user.id}`}>
          <img
            src={tweet.user.profileImageUrl || 'https://via.placeholder.com/40'}
            alt={`${tweet.user.fullName}'s avatar`}
            className="tweet-avatar"
          />
        </Link>
        <div className="tweet-user-info">
          <Link to={`/profile/${tweet.user.id}`} className="tweet-username">
            {tweet.user.fullName}
            {tweet.user.isVerified && <span style={{ color: '#1d9bf0', marginLeft: '4px' }}>✓</span>}
          </Link>
          <span className="tweet-handle">@{tweet.user.username}</span>
          <span className="tweet-time">·</span>
          <span className="tweet-time">{formatTime(tweet.createdAt)}</span>
        </div>
      </div>

      <div className="tweet-content">
        {tweet.content}
      </div>

      <div className="tweet-actions">
        <div className="tweet-action">
          <span>💬</span>
          <span>{tweet.repliesCount || 0}</span>
        </div>
        
        <div className="tweet-action">
          <span>🔄</span>
          <span>{tweet.retweetsCount || 0}</span>
        </div>
        
        <div 
          className={`tweet-action ${tweet.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span>{tweet.isLiked ? '❤️' : '🤍'}</span>
          <span>{tweet.likesCount || 0}</span>
        </div>
        
        <div className="tweet-action">
          <span>📤</span>
        </div>
      </div>
    </div>
  );
};

export default Tweet;