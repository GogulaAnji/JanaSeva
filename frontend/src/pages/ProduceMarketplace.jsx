import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHeart, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import './ProduceMarketplace.css';

const ProduceMarketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('-createdAt');

    const categories = [
        { id: 'all', name: 'All Produce', icon: '🌾' },
        { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'grains', name: 'Grains', icon: '🌾' },
        { id: 'pulses', name: 'Pulses', icon: '🫘' },
        { id: 'dairy', name: 'Dairy', icon: '🥛' },
        { id: 'organic', name: 'Organic', icon: '🌱' },
        { id: 'flowers', name: 'Flowers', icon: '🌸' },
        { id: 'spices', name: 'Spices', icon: '🌶️' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy, searchTerm]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                sort: sortBy,
                search: searchTerm || undefined,
            };

            const response = await api.get('/produce', { params });
            if (response.data.success) {
                setProducts(response.data.producePosts || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInterest = async (productId) => {
        try {
            await api.post(`/produce/${productId}/interest`);
            alert('Interest expressed! The farmer will be notified.');
        } catch (error) {
            console.error('Error expressing interest:', error);
        }
    };

    return (
        <div className="marketplace-page">
            <div className="container">
                {/* Header */}
                <div className="marketplace-header">
                    <h1>Fresh Produce Marketplace</h1>
                    <p>Buy directly from local farmers - Fresh, Affordable, No Middlemen</p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for fresh farm produce..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sort-filter">
                        <FiFilter />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="-createdAt">Newest First</option>
                            <option value="price.value">Price: Low to High</option>
                            <option value="-price.value">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category Chips */}
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

                {/* Products Grid */}
                <div className="products-section">
                    {loading ? (
                        <div className="loading">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <p>No products found in this category.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                                View All Products
                            </button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <Link to={`/produce/${product._id}`} className="product-image-container">
                                        <img
                                            src={product.images[0] || '/placeholder-product.jpg'}
                                            alt={product.productName}
                                            className="product-image"
                                        />
                                        {product.isOrganic && (
                                            <span className="organic-badge">🌱 Organic</span>
                                        )}
                                    </Link>

                                    <div className="product-content">
                                        <Link to={`/produce/${product._id}`}>
                                            <h3 className="product-name">{product.productName}</h3>
                                        </Link>

                                        <div className="product-price">
                                            <span className="price-value">₹{product.price.value}</span>
                                            <span className="price-unit">/{product.price.unit}</span>
                                        </div>

                                        <div className="product-quantity">
                                            <span>{product.quantity.value} {product.quantity.unit} available</span>
                                        </div>

                                        <div className="farmer-info">
                                            <div className="farmer-avatar">
                                                {product.farmer?.name?.charAt(0) || 'F'}
                                            </div>
                                            <div className="farmer-details">
                                                <span className="farmer-name">{product.farmer?.name}</span>
                                                <span className="farmer-location">
                                                    <FiMapPin size={12} />
                                                    {product.location?.district}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleInterest(product._id)}
                                            >
                                                I'm Interested
                                            </button>
                                            <button className="btn btn-icon">
                                                <FiHeart />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Floating Post Button (for farmers) */}
                <Link to="/post-product" className="floating-post-btn">
                    <span>+</span>
                    <span className="btn-text">Post Product</span>
                </Link>
            </div>
        </div>
    );
};

export default ProduceMarketplace;
