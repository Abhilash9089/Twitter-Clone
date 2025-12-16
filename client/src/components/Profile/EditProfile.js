import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const EditProfile = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile.profileImageUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loadUser, updateUser } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let updatedUser = null;

      // Upload profile picture if selected
      if (selectedFile) {
        const formDataFile = new FormData();
        formDataFile.append('avatar', selectedFile);
        
        const avatarResponse = await axios.post('/api/users/me/avatar', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedUser = avatarResponse.data.user;
      }

      // Update profile information
      const response = await axios.put('/api/users/me', formData);
      updatedUser = response.data;
      
      // Update user data in auth context
      updateUser(updatedUser);
      
      // Update parent component
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {error && (
            <div className="error-message" style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(244, 33, 46, 0.1)', border: '1px solid #f4212e', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          
          <div className="profile-picture-section">
            <div className="current-picture">
              <img
                src={previewUrl || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="profile-preview"
              />
            </div>
            <div className="upload-section">
              <label htmlFor="avatar-upload" className="upload-btn">
                Change Photo
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              maxLength={30}
              placeholder="Where are you located?"
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;