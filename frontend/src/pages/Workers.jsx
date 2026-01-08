import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiNavigation } from 'react-icons/fi';
import { useTranslation } from '../hooks/useTranslation';
import { useLocation } from '../context/LocationContext';
import { sortWorkersByDistance, formatDistance, filterWorkersByLocation } from '../utils/locationUtils';
import api from '../utils/api';
import './Workers.css';

const Workers = () => {
    const { t, language } = useTranslation();
    const { userLocation, requestLocation, locationPermission, isLoadingLocation } = useLocation();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const workerCategories = [
        { id: 'all', icon: '🔧' },
        { id: 'electrician', icon: '⚡' },
        { id: 'plumber', icon: '🔧' },
        { id: 'painter', icon: '🎨' },
        { id: 'carpenter', icon: '🪚' },
        { id: 'mechanic', icon: '🔩' },
        { id: 'cleaner', icon: '🧹' },
        { id: 'gardener', icon: '🌱' },
        { id: 'driver', icon: '🚗' },
        { id: 'cook', icon: '👨‍🍳' },
        { id: 'tailor', icon: '✂️' },
        { id: 'barber', icon: '💈' },
        { id: 'mason', icon: '🧱' },
    ];

    useEffect(() => {
        fetchWorkers();
        // Request location on component mount
        if (locationPermission === 'prompt') {
            requestLocation();
        }
    }, []);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/workers');
            if (response.data.success) {
                setWorkers(response.data.workers || []);
            }
        } catch (error) {
            console.error('Error fetching workers:', error);
            // For demo, show sample data if API fails
            setSampleWorkers();
        } finally {
            setLoading(false);
        }
    };

    const setSampleWorkers = () => {
        // Sample data for demonstration
        const sampleData = [
            {
                _id: '1',
                user: {
                    name: 'Ravi Kumar',
                    phone: '9876543210',
                    location: { district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.5,
                    reviewCount: 23,
                },
                skillCategory: 'electrician',
                skills: ['House Wiring', 'Appliance Repair', 'Installation'],
                experience: 5,
                availability: 'available',
                expectedPay: { amount: 500, period: 'day' },
            },
            {
                _id: '2',
                user: {
                    name: 'Suresh Reddy',
                    phone: '9876543211',
                    location: { district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.8,
                    reviewCount: 45,
                },
                skillCategory: 'plumber',
                skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Fitting'],
                experience: 8,
                availability: 'available',
                expectedPay: { amount: 600, period: 'day' },
            },
            {
                _id: '3',
                user: {
                    name: 'Prakash Singh',
                    phone: '9876543212',
                    location: { district: 'Bangalore', state: 'Karnataka' },
                    rating: 4.3,
                    reviewCount: 18,
                },
                skillCategory: 'painter',
                skills: ['Interior Painting', 'Exterior Painting', 'Texture'],
                experience: 6,
                availability: 'busy',
                expectedPay: { amount: 550, period: 'day' },
            },
        ];
        setWorkers(sampleData);
    };

    const filteredWorkers = workers.filter(worker => {
        const matchesCategory = selectedCategory === 'all' || worker.skillCategory === selectedCategory;
        const matchesSearch = worker.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.skillCategory?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Filter by location search if provided
    const locationFilteredWorkers = locationSearch
        ? filterWorkersByLocation(filteredWorkers, locationSearch)
        : filteredWorkers;

    // Sort by distance if user location is available
    const sortedWorkers = userLocation
        ? sortWorkersByDistance(locationFilteredWorkers, userLocation)
        : locationFilteredWorkers;

    return (
        <div className="workers-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>{t('workers.pageTitle')}</h1>
                    <p>{t('workers.pageSubtitle')}</p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={t('workers.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="search-bar">
                        <FiMapPin className="search-icon" />
                        <input
                            type="text"
                            placeholder={t('workers.location.searchByLocation')}
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                        />
                    </div>
                    {locationPermission !== 'granted' && (
                        <button
                            className="btn btn-outline btn-sm location-btn"
                            onClick={requestLocation}
                            disabled={isLoadingLocation}
                        >
                            <FiNavigation />
                            {isLoadingLocation ? 'Detecting...' : t('workers.location.enableLocation')}
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    <h3>{t('workers.categoryTitle')}</h3>
                    <div className="category-grid">
                        {workerCategories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{t(`workers.categories.${category.id}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workers List */}
                <div className="workers-section">
                    <div className="section-header">
                        <h2>
                            {selectedCategory === 'all'
                                ? t('workers.allWorkers')
                                : t(`workers.categories.${selectedCategory}`) + 's'}
                        </h2>
                        <span className="count">{sortedWorkers.length} {t('workers.available')}</span>
                    </div>

                    {loading ? (
                        <div className="loading">{t('workers.loading')}</div>
                    ) : sortedWorkers.length === 0 ? (
                        <div className="no-results card">
                            <p>{t('workers.noResults')}</p>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                                {t('workers.viewAll')}
                            </button>
                        </div>
                    ) : (
                        <div className="workers-grid">
                            {sortedWorkers.map(worker => (
                                <div key={worker._id} className="worker-card card">
                                    <div className="worker-header">
                                        <div className="worker-avatar">
                                            {worker.user?.name?.charAt(0) || 'W'}
                                        </div>
                                        <div className="worker-info">
                                            <h3>{worker.user?.name || 'Worker'}</h3>
                                            <p className="worker-category">
                                                {workerCategories.find(c => c.id === worker.skillCategory)?.icon}
                                                {' '}
                                                {worker.skillCategory?.charAt(0).toUpperCase() + worker.skillCategory?.slice(1)}
                                            </p>
                                        </div>
                                        <span className={`status-badge ${worker.availability}`}>
                                            {worker.availability === 'available' ? t('workers.status.available') : t('workers.status.busy')}
                                        </span>
                                    </div>

                                    <div className="worker-details">
                                        <div className="detail-row">
                                            <FiMapPin />
                                            <span>
                                                {worker.user?.location?.district}, {worker.user?.location?.state}
                                            </span>
                                        </div>
                                        {worker.distance !== null && worker.distance !== undefined && (
                                            <div className="detail-row distance-row">
                                                <FiNavigation className="distance-icon" />
                                                <span className="distance-badge">
                                                    {formatDistance(worker.distance, language)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <FiStar />
                                            <span>
                                                {worker.user?.rating?.toFixed(1) || '0.0'}
                                                ({worker.user?.reviewCount || 0} {t('workers.reviews')})
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="experience-badge">
                                                {worker.experience} {t('workers.yearsExperience')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="worker-skills">
                                        {worker.skills?.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>

                                    <div className="worker-footer">
                                        <div className="price">
                                            <span className="amount">₹{worker.expectedPay?.amount}</span>
                                            <span className="period">/{worker.expectedPay?.period}</span>
                                        </div>
                                        <Link
                                            to={`/workers/${worker._id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {t('workers.viewProfile')}
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

export default Workers;
