import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './PostProduct.css';

const PostProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        category: 'vegetables',
        price: { value: '', unit: 'per kg' },
        quantity: { value: '', unit: 'kg' },
        quality: 'standard',
        description: '',
        isOrganic: false,
    });

    const categories = [
        { id: 'vegetables', name: 'Vegetables' },
        { id: 'fruits', name: 'Fruits' },
        { id: 'grains', name: 'Grains' },
        { id: 'pulses', name: 'Pulses' },
        { id: 'dairy', name: 'Dairy' },
        { id: 'organic', name: 'Organic' },
        { id: 'flowers', name: 'Flowers' },
        { id: 'spices', name: 'Spices' },
        { id: 'other', name: 'Other' },
    ];

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        try {
            const response = await api.post('/produce/upload-images', formData, {
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
            alert('Please upload at least one image');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/produce', {
                ...formData,
                images,
            });

            if (response.data.success) {
                alert('Product posted successfully!');
                navigate('/marketplace');
            }
        } catch (error) {
            console.error('Error posting product:', error);
            alert('Failed to post product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-product-page">
            <div className="container">
                <div className="post-header">
                    <h1>Post Your Produce</h1>
                    <p>Share your fresh produce with buyers</p>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    {/* Image Upload */}
                    <div className="form-section">
                        <label className="section-label">Product Photos *</label>
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
                                <p>Upload Photos</p>
                                <span>Tap to add up to 5 images</span>
                            </label>
                        </div>

                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img} alt={`Preview ${index + 1}`} />
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

                    {/* Product Details */}
                    <div className="form-section">
                        <label className="section-label">Product Details</label>

                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Fresh Tomatoes"
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
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
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.price.value}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        price: { ...formData.price, value: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select
                                    value={formData.price.unit}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        price: { ...formData.price, unit: e.target.value }
                                    })}
                                >
                                    <option value="per kg">per kg</option>
                                    <option value="per quintal">per quintal</option>
                                    <option value="per piece">per piece</option>
                                    <option value="per dozen">per dozen</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Quantity *</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.quantity.value}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        quantity: { ...formData.quantity, value: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select
                                    value={formData.quantity.unit}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        quantity: { ...formData.quantity, unit: e.target.value }
                                    })}
                                >
                                    <option value="kg">kg</option>
                                    <option value="quintal">quintal</option>
                                    <option value="ton">ton</option>
                                    <option value="pieces">pieces</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Quality</label>
                            <div className="quality-selector">
                                {['premium', 'standard', 'economy'].map(q => (
                                    <button
                                        key={q}
                                        type="button"
                                        className={`quality-btn ${formData.quality === q ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, quality: q })}
                                    >
                                        {q.charAt(0).toUpperCase() + q.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                placeholder="Add details about your produce, harvest date, etc..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.isOrganic}
                                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                                />
                                <span>Organic Certified</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Posting...' : 'Publish Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostProduct;
