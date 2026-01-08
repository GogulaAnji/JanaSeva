import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: {
            village: '',
            mandal: '',
            district: '',
            state: '',
            pincode: '',
        },
        preferredLanguage: 'english',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: {
                    village: user.location?.village || '',
                    mandal: user.location?.mandal || '',
                    district: user.location?.district || '',
                    state: user.location?.state || '',
                    pincode: user.location?.pincode || '',
                },
                preferredLanguage: user.preferredLanguage || 'english',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('location.')) {
            const locationField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locationField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.put('/auth/update-profile', formData);

            if (response.data.success) {
                updateUser(response.data.user);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to original user data
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            location: {
                village: user.location?.village || '',
                mandal: user.location?.mandal || '',
                district: user.location?.district || '',
                state: user.location?.state || '',
                pincode: user.location?.pincode || '',
            },
            preferredLanguage: user.preferredLanguage || 'english',
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="container" style={{ padding: '3rem 0', minHeight: '70vh' }}>
                <div className="card">
                    <p>Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    {!isEditing && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="profile-content">
                    {/* Profile Picture Section */}
                    <div className="profile-picture-section card">
                        <div className="profile-picture">
                            <img
                                src={user.profilePicture || '/default-avatar.png'}
                                alt={user.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=' + user.name?.charAt(0);
                                }}
                            />
                        </div>
                        <div className="profile-info-summary">
                            <h2>{user.name}</h2>
                            <p className="role-badge">{user.role}</p>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-label">Rating</span>
                                    <span className="stat-value">⭐ {user.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Reviews</span>
                                    <span className="stat-value">{user.reviewCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Form */}
                    <div className="profile-details card">
                        <form onSubmit={handleSubmit}>
                            <h3>Personal Information</h3>

                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            </div>

                            <h3>Location</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="village">Village/Town</label>
                                    <input
                                        type="text"
                                        id="village"
                                        name="location.village"
                                        value={formData.location.village}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mandal">Mandal/Taluk</label>
                                    <input
                                        type="text"
                                        id="mandal"
                                        name="location.mandal"
                                        value={formData.location.mandal}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="district">District</label>
                                    <input
                                        type="text"
                                        id="district"
                                        name="location.district"
                                        value={formData.location.district}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="location.state"
                                        value={formData.location.state}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="location.pincode"
                                        value={formData.location.pincode}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        pattern="[0-9]{6}"
                                    />
                                </div>
                            </div>

                            <h3>Preferences</h3>

                            <div className="form-group">
                                <label htmlFor="preferredLanguage">Preferred Language</label>
                                <select
                                    id="preferredLanguage"
                                    name="preferredLanguage"
                                    value={formData.preferredLanguage}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <option value="english">English</option>
                                    <option value="telugu">Telugu</option>
                                    <option value="hindi">Hindi</option>
                                </select>
                            </div>

                            {isEditing && (
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
