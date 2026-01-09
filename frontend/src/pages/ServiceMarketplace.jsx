import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiPhone, FiMessageCircle, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import './ProduceMarketplace.css';

const ServiceMarketplace = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Services', icon: '🛠️' },
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
    ];

    useEffect(() => {
        fetchServices();
    }, [selectedCategory, searchTerm]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = {
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchTerm || undefined,
            };

            const response = await api.get('/services', { params });
            if (response.data.success) {
                setServices(response.data.servicePosts || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInterest = async (serviceId) => {
        try {
            await api.post(`/services/${serviceId}/interest`);
            alert('Interest expressed! The worker will be notified.');
        } catch (error) {
            console.error('Error expressing interest:', error);
        }
    };

    const getPricingDisplay = (pricing) => {
        const prices = [];
        if (pricing.hourly?.rate) {
            prices.push(`₹${pricing.hourly.rate}/hr${pricing.hourly.minHours > 1 ? ` (min ${pricing.hourly.minHours}h)` : ''}`);
        }
        if (pricing.daily?.rate) {
            prices.push(`₹${pricing.daily.rate}/day`);
        }
        if (pricing.perJob?.rate) {
            prices.push(`₹${pricing.perJob.rate}${pricing.perJob.description ? ` ${pricing.perJob.description}` : '/job'}`);
        }
        if (pricing.custom?.enabled) {
            prices.push('Negotiable');
        }
        return prices.join(' • ');
    };

    return (
        <div className="marketplace-page">
            <div className="container">
                <div className="marketplace-header">
                    <h1>Service Marketplace</h1>
                    <p>Find skilled workers for all your needs</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="category-chips">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="chip-icon">{category.icon}</span>
                            <span className="chip-name">{category.name}</span>
                        </button>
                    ))}
                </div>

                <div className="products-section">
                    {loading ? (
                        <div className="loading">Loading services...</div>
                    ) : services.length === 0 ? (
                        <div className="no-products">
                            <p>No services found in this category.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                                View All Services
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {services.map((service) => (
                                <div key={service._id} className="product-card">
                                    <Link to={`/services/${service._id}`} className="product-image-container">
                                        <img
                                            src={service.images[0] || '/placeholder-service.jpg'}
                                            alt={service.serviceName}
                                            className="product-image"
                                        />
                                        {service.hasOwnTools && (
                                            <span className="organic-badge">🛠️ Own Tools</span>
                                        )}
                                    </Link>

                                    <div className="product-content">
                                        <Link to={`/services/${service._id}`}>
                                            <h3 className="product-name">{service.serviceName}</h3>
                                        </Link>

                                        <div className="product-price">
                                            <span className="price-value">{getPricingDisplay(service.pricing)}</span>
                                        </div>

                                        {service.experience > 0 && (
                                            <div className="product-quantity">
                                                <span>{service.experience} years experience</span>
                                            </div>
                                        )}

                                        <div className="farmer-info">
                                            <div className="farmer-avatar">
                                                {service.worker?.name?.charAt(0) || 'W'}
                                            </div>
                                            <div className="farmer-details">
                                                <span className="farmer-name">{service.worker?.name}</span>
                                                <span className="farmer-location">
                                                    <FiMapPin size={12} />
                                                    {service.worker?.location?.district || 'Location'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="product-actions">
                                            <a
                                                href={`tel:${service.worker?.phone}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                <FiPhone /> Call
                                            </a>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleInterest(service._id)}
                                            >
                                                <FiMessageCircle /> Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Link to="/post-service" className="floating-post-btn">
                    <span>+</span>
                    <span className="btn-text">Post Service</span>
                </Link>
            </div>
        </div>
    );
};

export default ServiceMarketplace;
