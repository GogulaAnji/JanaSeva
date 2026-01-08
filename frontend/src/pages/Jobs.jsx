import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import api from '../utils/api';
import './Jobs.css';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const jobCategories = [
        { id: 'all', name: 'All Jobs', icon: '💼' },
        { id: 'farming', name: 'Farming', icon: '🌾' },
        { id: 'driver', name: 'Driver', icon: '🚗' },
        { id: 'delivery', name: 'Delivery', icon: '📦' },
        { id: 'construction', name: 'Construction', icon: '🏗️' },
        { id: 'housekeeping', name: 'Housekeeping', icon: '🧹' },
        { id: 'security', name: 'Security', icon: '🛡️' },
        { id: 'retail', name: 'Retail', icon: '🏪' },
        { id: 'food-service', name: 'Food Service', icon: '🍽️' },
        { id: 'helper', name: 'Helper', icon: '🤝' },
    ];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jobs');
            if (response.data.success) {
                setJobs(response.data.jobs || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setSampleJobs();
        } finally {
            setLoading(false);
        }
    };

    const setSampleJobs = () => {
        const sampleData = [
            {
                _id: '1',
                title: 'Farm Helper Needed',
                company: 'Green Fields Farm',
                category: 'farming',
                jobType: 'daily',
                location: { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
                salary: { min: 400, max: 500, period: 'day' },
                description: 'Need helper for harvesting season. Work from 6 AM to 2 PM.',
                requirements: ['Physical fitness', 'No experience required'],
                postedDate: new Date(),
                urgent: true,
            },
            {
                _id: '2',
                title: 'Driver for One Day',
                company: 'Local Transport',
                category: 'driver',
                jobType: 'temporary',
                location: { city: 'Secunderabad', district: 'Hyderabad', state: 'Telangana' },
                salary: { min: 800, max: 1000, period: 'day' },
                description: 'Need driver for city delivery. Must have valid license.',
                requirements: ['Valid driving license', '2+ years experience'],
                postedDate: new Date(Date.now() - 86400000),
                urgent: false,
            },
            {
                _id: '3',
                title: 'Delivery Boy',
                company: 'Quick Delivery Services',
                category: 'delivery',
                jobType: 'part-time',
                location: { city: 'Kukatpally', district: 'Hyderabad', state: 'Telangana' },
                salary: { min: 10000, max: 15000, period: 'month' },
                description: 'Deliver packages in local area. Bike provided.',
                requirements: ['Own bike preferred', 'Know local area'],
                postedDate: new Date(Date.now() - 172800000),
                urgent: false,
            },
            {
                _id: '4',
                title: 'Construction Helper',
                company: 'Build Right Constructions',
                category: 'construction',
                jobType: 'contract',
                location: { city: 'Gachibowli', district: 'Hyderabad', state: 'Telangana' },
                salary: { min: 500, max: 600, period: 'day' },
                description: 'Construction site helper needed for 2 months.',
                requirements: ['Physical strength', 'Willing to work outdoors'],
                postedDate: new Date(Date.now() - 259200000),
                urgent: true,
            },
        ];
        setJobs(sampleData);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    };

    return (
        <div className="jobs-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Find Local Jobs</h1>
                    <p>Daily wages, part-time, and temporary work opportunities</p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                    <h3>Job Categories</h3>
                    <div className="category-grid">
                        {jobCategories.map(category => (
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

                {/* Jobs List */}
                <div className="jobs-section">
                    <div className="section-header">
                        <h2>
                            {selectedCategory === 'all'
                                ? 'All Jobs'
                                : jobCategories.find(c => c.id === selectedCategory)?.name + ' Jobs'}
                        </h2>
                        <span className="count">{filteredJobs.length} jobs</span>
                    </div>

                    {loading ? (
                        <div className="loading">Loading jobs...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="no-results card">
                            <p>No jobs found in this category.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedCategory('all')}>
                                View All Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {filteredJobs.map(job => (
                                <div key={job._id} className="job-card card">
                                    <div className="job-header">
                                        <div>
                                            <h3>{job.title}</h3>
                                            <p className="company-name">{job.company}</p>
                                        </div>
                                        {job.urgent && (
                                            <span className="urgent-badge">🔥 Urgent</span>
                                        )}
                                    </div>

                                    <div className="job-meta">
                                        <span className="job-type-badge">{job.jobType}</span>
                                        <span className="category-badge">
                                            {jobCategories.find(c => c.id === job.category)?.icon}
                                            {' '}
                                            {job.category}
                                        </span>
                                    </div>

                                    <p className="job-description">{job.description}</p>

                                    <div className="job-details">
                                        <div className="detail-item">
                                            <FiMapPin />
                                            <span>{job.location?.city}, {job.location?.district}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiDollarSign />
                                            <span>
                                                ₹{job.salary?.min}-{job.salary?.max}/{job.salary?.period}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <FiClock />
                                            <span>{getTimeAgo(job.postedDate)}</span>
                                        </div>
                                    </div>

                                    <div className="job-footer">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Apply Now
                                        </Link>
                                        <button className="btn btn-outline btn-sm">
                                            Save
                                        </button>
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

export default Jobs;
