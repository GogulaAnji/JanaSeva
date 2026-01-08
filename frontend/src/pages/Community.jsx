import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiHeart, FiAlertCircle, FiUsers, FiPhone } from 'react-icons/fi';
import api from '../utils/api';
import './Community.css';

const Community = () => {
    const [activeTab, setActiveTab] = useState('blood-donation');
    const [bloodRequests, setBloodRequests] = useState([]);
    const [emergencyHelp, setEmergencyHelp] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCommunityData();
    }, [activeTab]);

    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            // In production, fetch from API
            setSampleData();
        } catch (error) {
            console.error('Error fetching community data:', error);
            setSampleData();
        } finally {
            setLoading(false);
        }
    };

    const setSampleData = () => {
        // Blood Donation Requests
        const bloodData = [
            {
                _id: '1',
                patientName: 'Ravi Kumar',
                bloodGroup: 'O+',
                unitsNeeded: 2,
                hospital: 'Gandhi Hospital',
                location: 'Secunderabad, Hyderabad',
                urgency: 'urgent',
                contactPerson: 'Suresh',
                contactNumber: '9876543240',
                postedDate: new Date(),
                description: 'Needed for surgery. Patient admitted in ICU.',
            },
            {
                _id: '2',
                patientName: 'Lakshmi Devi',
                bloodGroup: 'B+',
                unitsNeeded: 3,
                hospital: 'Yashoda Hospital',
                location: 'Malakpet, Hyderabad',
                urgency: 'critical',
                contactPerson: 'Ramesh',
                contactNumber: '9876543241',
                postedDate: new Date(Date.now() - 86400000),
                description: 'Emergency case. Immediate requirement.',
            },
            {
                _id: '3',
                patientName: 'Krishna Reddy',
                bloodGroup: 'A-',
                unitsNeeded: 1,
                hospital: 'Apollo Hospital',
                location: 'Jubilee Hills, Hyderabad',
                urgency: 'normal',
                contactPerson: 'Prasad',
                contactNumber: '9876543242',
                postedDate: new Date(Date.now() - 172800000),
                description: 'Scheduled surgery next week.',
            },
        ];

        // Emergency Help Requests
        const emergencyData = [
            {
                _id: '1',
                title: 'Need Ambulance Service',
                category: 'ambulance',
                description: 'Urgent ambulance needed from Kukatpally to Gandhi Hospital',
                location: 'Kukatpally, Hyderabad',
                urgency: 'critical',
                contactPerson: 'Vijay',
                contactNumber: '9876543250',
                postedDate: new Date(),
            },
            {
                _id: '2',
                title: 'Food for Flood Victims',
                category: 'food',
                description: 'Need volunteers to distribute food packets in flood-affected areas',
                location: 'Khammam District',
                urgency: 'urgent',
                contactPerson: 'NGO Helping Hands',
                contactNumber: '9876543251',
                postedDate: new Date(Date.now() - 86400000),
            },
            {
                _id: '3',
                title: 'Medical Camp Volunteers',
                category: 'volunteer',
                description: 'Looking for volunteers for free medical camp in rural areas',
                location: 'Warangal',
                urgency: 'normal',
                contactPerson: 'Dr. Sharma',
                contactNumber: '9876543252',
                postedDate: new Date(Date.now() - 259200000),
            },
        ];

        setBloodRequests(bloodData);
        setEmergencyHelp(emergencyData);
    };

    const handleDonate = (request) => {
        toast.success('Thank you for your willingness to help! Contact details shown.');
    };

    const handleHelp = (request) => {
        toast.success('Thank you for offering help! Contact details shown.');
    };

    const handlePostRequest = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        toast.info('This feature will be available soon. Your request will be posted to the community.');
        setShowModal(false);
    };

    const getUrgencyClass = (urgency) => {
        switch (urgency) {
            case 'critical': return 'critical';
            case 'urgent': return 'urgent';
            default: return 'normal';
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    return (
        <div className="community-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Community Services</h1>
                    <p>Help your community - Save lives, Support those in need</p>
                </div>

                {/* Service Tabs */}
                <div className="service-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'blood-donation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blood-donation')}
                    >
                        <FiHeart /> Blood Donation
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'emergency' ? 'active' : ''}`}
                        onClick={() => setActiveTab('emergency')}
                    >
                        <FiAlertCircle /> Emergency Help
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('volunteer')}
                    >
                        <FiUsers /> Volunteer
                    </button>
                </div>

                {/* Blood Donation Tab */}
                {activeTab === 'blood-donation' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Blood Donation Requests</h2>
                            <button className="btn btn-primary" onClick={handlePostRequest}>
                                Post Request
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading">Loading requests...</div>
                        ) : (
                            <div className="requests-grid">
                                {bloodRequests.map(request => (
                                    <div key={request._id} className={`request-card card ${getUrgencyClass(request.urgency)}`}>
                                        <div className="card-header">
                                            <div className="blood-group-badge">
                                                {request.bloodGroup}
                                            </div>
                                            <span className={`urgency-badge ${request.urgency}`}>
                                                {request.urgency === 'critical' && '🚨 Critical'}
                                                {request.urgency === 'urgent' && '⚠️ Urgent'}
                                                {request.urgency === 'normal' && '📌 Normal'}
                                            </span>
                                        </div>

                                        <h3>Patient: {request.patientName}</h3>
                                        <p className="description">{request.description}</p>

                                        <div className="request-details">
                                            <div className="detail-item">
                                                <strong>Units Needed:</strong> {request.unitsNeeded}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Hospital:</strong> {request.hospital}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Location:</strong> {request.location}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Contact:</strong> {request.contactPerson}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Posted:</strong> {getTimeAgo(request.postedDate)}
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <a
                                                href={`tel:${request.contactNumber}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                <FiPhone /> Call
                                            </a>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleDonate(request)}
                                            >
                                                <FiHeart /> I Can Donate
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Emergency Help Tab */}
                {activeTab === 'emergency' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Emergency Help Requests</h2>
                            <button className="btn btn-primary" onClick={handlePostRequest}>
                                Post Request
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading">Loading requests...</div>
                        ) : (
                            <div className="requests-grid">
                                {emergencyHelp.map(request => (
                                    <div key={request._id} className={`request-card card ${getUrgencyClass(request.urgency)}`}>
                                        <div className="card-header">
                                            <span className="category-badge">{request.category}</span>
                                            <span className={`urgency-badge ${request.urgency}`}>
                                                {request.urgency === 'critical' && '🚨 Critical'}
                                                {request.urgency === 'urgent' && '⚠️ Urgent'}
                                                {request.urgency === 'normal' && '📌 Normal'}
                                            </span>
                                        </div>

                                        <h3>{request.title}</h3>
                                        <p className="description">{request.description}</p>

                                        <div className="request-details">
                                            <div className="detail-item">
                                                <strong>Location:</strong> {request.location}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Contact:</strong> {request.contactPerson}
                                            </div>
                                            <div className="detail-item">
                                                <strong>Posted:</strong> {getTimeAgo(request.postedDate)}
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <a
                                                href={`tel:${request.contactNumber}`}
                                                className="btn btn-outline btn-sm"
                                            >
                                                <FiPhone /> Call
                                            </a>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleHelp(request)}
                                            >
                                                I Can Help
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Volunteer Tab */}
                {activeTab === 'volunteer' && (
                    <div className="tab-content">
                        <div className="volunteer-info card">
                            <h2>Become a Volunteer</h2>
                            <p>Join our community of volunteers making a difference every day.</p>

                            <div className="volunteer-opportunities">
                                <div className="opportunity">
                                    <h3>🩸 Blood Donation Camps</h3>
                                    <p>Help organize and participate in blood donation drives</p>
                                </div>
                                <div className="opportunity">
                                    <h3>🏥 Medical Camps</h3>
                                    <p>Assist in free medical camps in rural areas</p>
                                </div>
                                <div className="opportunity">
                                    <h3>🍲 Food Distribution</h3>
                                    <p>Help distribute food to those in need</p>
                                </div>
                                <div className="opportunity">
                                    <h3>📚 Education Support</h3>
                                    <p>Teach and mentor underprivileged children</p>
                                </div>
                            </div>

                            <button className="btn btn-primary btn-lg">
                                Register as Volunteer
                            </button>
                        </div>
                    </div>
                )}

                {/* Post Request Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Post {activeTab === 'blood-donation' ? 'Blood Donation' : 'Emergency Help'} Request</h2>
                                <button className="close-btn" onClick={handleCloseModal}>×</button>
                            </div>
                            <form onSubmit={handleSubmitRequest}>
                                <div className="form-group">
                                    <label>Title/Patient Name *</label>
                                    <input type="text" required className="form-control" placeholder="Enter title or patient name" />
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea required className="form-control" rows="4" placeholder="Provide detailed information"></textarea>
                                </div>
                                {activeTab === 'blood-donation' && (
                                    <>
                                        <div className="form-group">
                                            <label>Blood Group *</label>
                                            <select required className="form-control">
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Units Needed *</label>
                                            <input type="number" required className="form-control" min="1" placeholder="Number of units" />
                                        </div>
                                        <div className="form-group">
                                            <label>Hospital Name *</label>
                                            <input type="text" required className="form-control" placeholder="Hospital name" />
                                        </div>
                                    </>
                                )}
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input type="text" required className="form-control" placeholder="City, District" />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person *</label>
                                    <input type="text" required className="form-control" placeholder="Contact person name" />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number *</label>
                                    <input type="tel" required className="form-control" placeholder="10-digit mobile number" pattern="[0-9]{10}" />
                                </div>
                                <div className="form-group">
                                    <label>Urgency Level *</label>
                                    <select required className="form-control">
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
