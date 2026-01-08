import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiPhone } from 'react-icons/fi';
import api from '../utils/api';
import './Farmers.css';

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const produceCategories = [
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
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/farmers');
            if (response.data.success) {
                setFarmers(response.data.farmers || []);
            }
        } catch (error) {
            console.error('Error fetching farmers:', error);
            setSampleFarmers();
        } finally {
            setLoading(false);
        }
    };

    const setSampleFarmers = () => {
        const sampleData = [
            {
                _id: '1',
                user: {
                    name: 'Ramesh Goud',
                    phone: '9876543220',
                    location: { village: 'Kondapur', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.7,
                    reviewCount: 34,
                },
                farmSize: 5,
                produceTypes: ['vegetables', 'organic'],
                currentProduce: [
                    { name: 'Tomatoes', quantity: '100 kg', price: 30 },
                    { name: 'Onions', quantity: '150 kg', price: 40 },
                    { name: 'Potatoes', quantity: '200 kg', price: 25 },
                ],
                isOrganic: true,
            },
            {
                _id: '2',
                user: {
                    name: 'Krishna Reddy',
                    phone: '9876543221',
                    location: { village: 'Shamshabad', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.9,
                    reviewCount: 56,
                },
                farmSize: 10,
                produceTypes: ['fruits', 'vegetables'],
                currentProduce: [
                    { name: 'Mangoes', quantity: '50 kg', price: 80 },
                    { name: 'Bananas', quantity: '100 dozen', price: 40 },
                    { name: 'Papaya', quantity: '75 kg', price: 35 },
                ],
                isOrganic: false,
            },
            {
                _id: '3',
                user: {
                    name: 'Lakshmi Devi',
                    phone: '9876543222',
                    location: { village: 'Patancheru', district: 'Sangareddy', state: 'Telangana' },
                    rating: 4.5,
                    reviewCount: 28,
                },
                farmSize: 3,
                produceTypes: ['vegetables', 'flowers'],
                currentProduce: [
                    { name: 'Spinach', quantity: '50 kg', price: 20 },
                    { name: 'Coriander', quantity: '30 kg', price: 60 },
                    { name: 'Marigold', quantity: '100 bunches', price: 15 },
                ],
                isOrganic: true,
            },
        ];
        setFarmers(sampleData);
    };

    const filteredFarmers = farmers.filter(farmer => {
        const matchesCategory = selectedCategory === 'all' ||
            farmer.produceTypes?.includes(selectedCategory);
        const matchesSearch = farmer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.currentProduce?.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="farmers-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Fresh from Farms</h1>
                    <p>Buy directly from local farmers - Fresh, Affordable, No Middlemen</p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for produce or farmer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    <h3>Produce Categories</h3>
                    <div className="category-grid">
                        {produceCategories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Farmers List */}
                <div className="farmers-section">
                    <div className="section-header">
                        <h2>
                            {selectedCategory === 'all'
                                ? 'All Farmers'
                                : produceCategories.find(c => c.id === selectedCategory)?.name}
                        </h2>
                        <span className="count">{filteredFarmers.length} farmers</span>
                    </div>

                    {loading ? (
                        <div className="loading">Loading farmers...</div>
                    ) : filteredFarmers.length === 0 ? (
                        <div className="no-results card">
                            <p>No farmers found in this category.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                                View All Farmers
                            </button>
                        </div>
                    ) : (
                        <div className="farmers-grid">
                            {filteredFarmers.map(farmer => (
                                <div key={farmer._id} className="farmer-card card">
                                    <div className="farmer-header">
                                        <div className="farmer-avatar">
                                            {farmer.user?.name?.charAt(0) || 'F'}
                                        </div>
                                        <div className="farmer-info">
                                            <h3>{farmer.user?.name || 'Farmer'}</h3>
                                            <p className="farmer-location">
                                                <FiMapPin />
                                                {farmer.user?.location?.village}, {farmer.user?.location?.district}
                                            </p>
                                        </div>
                                        {farmer.isOrganic && (
                                            <span className="organic-badge">🌱 Organic</span>
                                        )}
                                    </div>

                                    <div className="farmer-details">
                                        <div className="detail-row">
                                            <span>Farm Size:</span>
                                            <strong>{farmer.farmSize} acres</strong>
                                        </div>
                                        <div className="detail-row">
                                            <FiStar />
                                            <span>
                                                {farmer.user?.rating?.toFixed(1) || '0.0'}
                                                ({farmer.user?.reviewCount || 0} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="produce-section">
                                        <h4>Available Produce</h4>
                                        <div className="produce-list">
                                            {farmer.currentProduce?.map((produce, index) => (
                                                <div key={index} className="produce-item">
                                                    <div className="produce-info">
                                                        <span className="produce-name">{produce.name}</span>
                                                        <span className="produce-quantity">{produce.quantity}</span>
                                                    </div>
                                                    <div className="produce-price">
                                                        ₹{produce.price}/kg
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="farmer-footer">
                                        <a
                                            href={`tel:${farmer.user?.phone}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <FiPhone /> Call
                                        </a>
                                        <Link
                                            to={`/farmers/${farmer._id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Farmers;
