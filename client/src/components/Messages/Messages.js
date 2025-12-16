import React from 'react';
import Sidebar from '../Layout/Sidebar';

const Messages = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <div style={{ borderBottom: '1px solid #2f3336', padding: '16px 20px' }}>
          <h2>Messages</h2>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#71767b' }}>
          <h3>Welcome to your inbox!</h3>
          <p>Drop a line, share posts and more with private conversations between you and others on Twitter.</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;