import React from 'react';
import Tweet from './Tweet';

const TweetList = ({ tweets, onLike }) => {
  if (!tweets || tweets.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#71767b' }}>
        No tweets yet. Start following people or create your first tweet!
      </div>
    );
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default TweetList;