import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiX } from 'react-icons/fi';
import api from '../utils/api';
import './PostProduct.css';

const PostService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        serviceName: '',
        category: 'electrician',
        description: '',
        pricing: {
            hourly: { rate: '', minHours: 1 },
            daily: { rate: '' },
            perJob: { rate: '', description: '' },
            custom: { enabled: false, description: '' },
        },
        skills: '',
        experience: '',
        hasOwnTools: false,
    });

    const categories = [
        { id: 'electrician', name: 'Electrician', icon: '⚡' },
        { id: 'plumber', name: 'Plumber', icon: '🔧' },
        { id: 'painter', name: 'Painter', icon: '🎨' },
        { id: 'carpenter', name: 'Carpenter', icon: '🪚' },
        { id: 'mason', name: 'Mason', icon: '🧱' },
        { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
        { id: 'gardener', name: 'Gardener', icon: '🌿' },
        { id: 'mechanic', name: 'Mechanic', icon: '🔩' },
        { id: 'driver', name: 'Driver', icon: '🚗' },
        { id: 'cook', name: 'Cook', icon: '👨‍🍳' },
        { id: 'tutor', name: 'Tutor', icon: '📚' },
        { id: 'other', name: 'Other', icon: '🛠️' },
    ];

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const formDataObj = new FormData();
        files.forEach(file => formDataObj.append('images', file));

        try {
            const response = await api.post('/services/upload-images', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setImages([...images, ...response.data.images]);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Please upload at least one image of your work');
            return;
        }

        try {
            setLoading(true);

            // Process skills
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

            const response = await api.post('/services', {
                ...formData,
                images,
                skills: skillsArray,
                experience: Number(formData.experience) || 0,
            });

            if (response.data.success) {
                alert('Service posted successfully!');
                navigate('/services');
            }
        } catch (error) {
            console.error('Error posting service:', error);
            alert('Failed to post service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-product-page">
            <div className="container">
                <div className="post-header">
                    <h1>Post Your Service</h1>
                    <p>Share your skills and connect with customers</p>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    {/* Image Upload */}
                    <div className="form-section">
                        <label className="section-label">Work Photos *</label>
                        <div className="image-upload-area">
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image-upload" className="upload-box">
                                <FiCamera size={40} />
                                <p>Upload Work Photos</p>
                                <span>Show your previous work (up to 5 images)</span>
                            </label>
                        </div>

                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img} alt={`Work ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={() => removeImage(index)}
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Service Details */}
                    <div className="form-section">
                        <label className="section-label">Service Details</label>

                        <div className="form-group">
                            <label>Service Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Electrical Wiring & Repairs"
                                value={formData.serviceName}
                                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                placeholder="Describe your service, what's included, your expertise..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Wiring, Installation, Repair"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                />
                                <small>Separate with commas</small>
                            </div>
                            <div className="form-group">
                                <label>Experience (years)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="form-section">
                        <label className="section-label">Pricing (Add at least one)</label>

                        <div className="form-group">
                            <label>Hourly Rate</label>
                            <div className="form-row">
                                <input
                                    type="number"
                                    placeholder="₹200"
                                    value={formData.pricing.hourly.rate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            hourly: { ...formData.pricing.hourly, rate: e.target.value }
                                        }
                                    })}
                                />
                                <input
                                    type="number"
                                    placeholder="Min hours"
                                    value={formData.pricing.hourly.minHours}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            hourly: { ...formData.pricing.hourly, minHours: e.target.value }
                                        }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Daily Rate</label>
                            <input
                                type="number"
                                placeholder="₹500"
                                value={formData.pricing.daily.rate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pricing: {
                                        ...formData.pricing,
                                        daily: { rate: e.target.value }
                                    }
                                })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Per Job Rate</label>
                            <div className="form-row">
                                <input
                                    type="number"
                                    placeholder="₹1000"
                                    value={formData.pricing.perJob.rate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            perJob: { ...formData.pricing.perJob, rate: e.target.value }
                                        }
                                    })}
                                />
                                <input
                                    type="text"
                                    placeholder="per room, per installation..."
                                    value={formData.pricing.perJob.description}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            perJob: { ...formData.pricing.perJob, description: e.target.value }
                                        }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.pricing.custom.enabled}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            custom: { ...formData.pricing.custom, enabled: e.target.checked }
                                        }
                                    })}
                                />
                                <span>Negotiable/Custom Pricing</span>
                            </label>
                            {formData.pricing.custom.enabled && (
                                <input
                                    type="text"
                                    placeholder="e.g., Depends on work scope"
                                    value={formData.pricing.custom.description}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        pricing: {
                                            ...formData.pricing,
                                            custom: { ...formData.pricing.custom, description: e.target.value }
                                        }
                                    })}
                                    style={{ marginTop: '0.5rem' }}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasOwnTools}
                                    onChange={(e) => setFormData({ ...formData, hasOwnTools: e.target.checked })}
                                />
                                <span>I have my own tools/equipment</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Posting...' : 'Publish Service'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostService;
