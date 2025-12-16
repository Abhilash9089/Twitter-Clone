import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Layout/Sidebar';
import TweetList from '../Tweet/TweetList';
import EditProfile from './EditProfile';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchProfile();
    fetchUserTweets();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserTweets = async () => {
    try {
      const response = await axios.get(`/api/tweets/user/${id}`);
      setTweets(response.data);
    } catch (error) {
      console.error('Error fetching user tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (profile.isFollowing) {
        await axios.delete(`/api/users/${id}/follow`);
      } else {
        await axios.post(`/api/users/${id}/follow`);
      }
      
      setProfile({
        ...profile,
        isFollowing: !profile.isFollowing,
        followersCount: profile.isFollowing 
          ? profile.followersCount - 1 
          : profile.followersCount + 1
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
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
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading || !profile) {
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
          <h2>{profile.fullName}</h2>
          <p style={{ color: '#71767b', margin: 0 }}>{profile.tweetsCount} Tweets</p>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img
              src={profile.profileImageUrl || 'https://via.placeholder.com/80'}
              alt={`${profile.fullName}'s avatar`}
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '16px' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>
                {profile.fullName}
                {profile.isVerified && <span style={{ color: '#1d9bf0', marginLeft: '4px' }}>✓</span>}
              </h3>
              <p style={{ color: '#71767b', margin: '4px 0' }}>@{profile.username}</p>
              {currentUser.id === profile.id ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px' }}
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`btn ${profile.isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ marginTop: '8px' }}
                >
                  {profile.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {profile.bio && (
            <p style={{ marginBottom: '16px' }}>{profile.bio}</p>
          )}

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: '#71767b' }}>
            <span><strong style={{ color: '#fff' }}>{profile.followingCount}</strong> Following</span>
            <span><strong style={{ color: '#fff' }}>{profile.followersCount}</strong> Followers</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2f3336' }}>
          <TweetList tweets={tweets} onLike={handleLikeTweet} />
        </div>
      </div>

      {showEditModal && (
        <EditProfile
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;