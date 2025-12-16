import React from 'react';
import Sidebar from '../Layout/Sidebar';

const Notifications = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <div style={{ borderBottom: '1px solid #2f3336', padding: '16px 20px' }}>
          <h2>Notifications</h2>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#71767b' }}>
          <h3>No notifications yet</h3>
          <p>When someone likes, retweets, or follows you, you'll see it here.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;