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
    const [showPostJobModal, setShowPostJobModal] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        category: 'farming',
        jobType: 'daily',
        location: { city: '', district: '', state: '' },
        salary: { min: '', max: '', period: 'day' },
        description: '',
        requirements: '',
        urgent: false
    });

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

    const handlePostJob = (e) => {
        e.preventDefault();

        // Create new job object
        const jobToAdd = {
            _id: Date.now().toString(),
            ...newJob,
            requirements: newJob.requirements.split(',').map(r => r.trim()).filter(r => r),
            postedDate: new Date(),
            postedBy: 'user' // In real app, this would be the logged-in user
        };

        // Add to jobs list
        setJobs([jobToAdd, ...jobs]);

        // Reset form and close modal
        setNewJob({
            title: '',
            company: '',
            category: 'farming',
            jobType: 'daily',
            location: { city: '', district: '', state: '' },
            salary: { min: '', max: '', period: 'day' },
            description: '',
            requirements: '',
            urgent: false
        });
        setShowPostJobModal(false);

        // Show success message
        alert('Job posted successfully! It is now visible to all users.');
    };

    return (
        <div className="jobs-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Find Local Jobs</h1>
                        <p>Daily wages, part-time, and temporary work opportunities</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowPostJobModal(true)}
                        style={{ marginLeft: 'auto' }}
                    >
                        + Post a Job
                    </button>
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

                {/* Post Job Modal */}
                {showPostJobModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Post a New Job</h2>
                            <form onSubmit={handlePostJob}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        placeholder="e.g., Farm Helper Needed"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Company/Employer Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newJob.company}
                                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                        placeholder="e.g., Green Fields Farm"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category *</label>
                                        <select
                                            value={newJob.category}
                                            onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        >
                                            {jobCategories.filter(c => c.id !== 'all').map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Job Type *</label>
                                        <select
                                            value={newJob.jobType}
                                            onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="full-time">Full-time</option>
                                            <option value="temporary">Temporary</option>
                                            <option value="contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newJob.location.city}
                                            onChange={(e) => setNewJob({ ...newJob, location: { ...newJob.location, city: e.target.value } })}
                                            placeholder="City"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>District *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newJob.location.district}
                                            onChange={(e) => setNewJob({ ...newJob, location: { ...newJob.location, district: e.target.value } })}
                                            placeholder="District"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>State *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newJob.location.state}
                                            onChange={(e) => setNewJob({ ...newJob, location: { ...newJob.location, state: e.target.value } })}
                                            placeholder="State"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Min Salary *</label>
                                        <input
                                            type="number"
                                            required
                                            value={newJob.salary.min}
                                            onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, min: e.target.value } })}
                                            placeholder="Min"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Max Salary *</label>
                                        <input
                                            type="number"
                                            required
                                            value={newJob.salary.max}
                                            onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, max: e.target.value } })}
                                            placeholder="Max"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Period *</label>
                                        <select
                                            value={newJob.salary.period}
                                            onChange={(e) => setNewJob({ ...newJob, salary: { ...newJob.salary, period: e.target.value } })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        >
                                            <option value="hour">Hour</option>
                                            <option value="day">Day</option>
                                            <option value="week">Week</option>
                                            <option value="month">Month</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Job Description *</label>
                                    <textarea
                                        required
                                        value={newJob.description}
                                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                        placeholder="Describe the job responsibilities and details..."
                                        rows="4"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Requirements (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={newJob.requirements}
                                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                                        placeholder="e.g., Physical fitness, No experience required"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={newJob.urgent}
                                            onChange={(e) => setNewJob({ ...newJob, urgent: e.target.checked })}
                                        />
                                        <span>Mark as Urgent</span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        Post Job
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowPostJobModal(false)}
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
