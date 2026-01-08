import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('all');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const specializations = [
        { id: 'all', name: 'All Doctors', icon: '👨‍⚕️' },
        { id: 'general', name: 'General Physician', icon: '🩺' },
        { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
        { id: 'gynecology', name: 'Gynecology', icon: '👩‍⚕️' },
        { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
        { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
        { id: 'dentistry', name: 'Dentistry', icon: '🦷' },
        { id: 'dermatology', name: 'Dermatology', icon: '💆' },
        { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️' },
        { id: 'ent', name: 'ENT', icon: '👂' },
    ];

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/doctors');
            if (response.data.success) {
                setDoctors(response.data.doctors || []);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setSampleDoctors();
        } finally {
            setLoading(false);
        }
    };

    const setSampleDoctors = () => {
        const sampleData = [
            {
                _id: '1',
                user: {
                    name: 'Dr. Rajesh Kumar',
                    phone: '9876543230',
                    location: { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.8,
                    reviewCount: 156,
                },
                specialization: 'general',
                qualification: 'MBBS, MD',
                experience: 15,
                consultationFee: 500,
                clinicName: 'Kumar Clinic',
                availability: '24/7',
                availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
                isEmergency: true,
            },
            {
                _id: '2',
                user: {
                    name: 'Dr. Priya Sharma',
                    phone: '9876543231',
                    location: { city: 'Secunderabad', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.9,
                    reviewCount: 203,
                },
                specialization: 'pediatrics',
                qualification: 'MBBS, DCH',
                experience: 12,
                consultationFee: 600,
                clinicName: 'Child Care Clinic',
                availability: 'Mon-Sat: 9 AM - 8 PM',
                availableSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
                isEmergency: false,
            },
            {
                _id: '3',
                user: {
                    name: 'Dr. Suresh Reddy',
                    phone: '9876543232',
                    location: { city: 'Kukatpally', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.7,
                    reviewCount: 98,
                },
                specialization: 'cardiology',
                qualification: 'MBBS, MD, DM',
                experience: 20,
                consultationFee: 1000,
                clinicName: 'Heart Care Center',
                availability: 'Mon-Fri: 10 AM - 6 PM',
                availableSlots: ['10:00 AM', '01:00 PM', '04:00 PM'],
                isEmergency: true,
            },
            {
                _id: '4',
                user: {
                    name: 'Dr. Lakshmi Devi',
                    phone: '9876543233',
                    location: { city: 'Gachibowli', district: 'Hyderabad', state: 'Telangana' },
                    rating: 4.6,
                    reviewCount: 87,
                },
                specialization: 'gynecology',
                qualification: 'MBBS, DGO',
                experience: 10,
                consultationFee: 700,
                clinicName: 'Women\'s Health Clinic',
                availability: '24/7',
                availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM'],
                isEmergency: true,
            },
        ];
        setDoctors(sampleData);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialization = selectedSpecialization === 'all' ||
            doctor.specialization === selectedSpecialization;
        const matchesSearch = doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.clinicName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSpecialization && matchesSearch;
    });

    const handleBookAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
    };

    const BookingModal = () => {
        const [appointmentData, setAppointmentData] = useState({
            date: '',
            customDate: '',
            time: '',
            customTime: '',
            useCustomTime: false,
            type: 'clinic',
            reason: '',
            duration: '30',
        });

        // Generate next 7 days for quick selection
        const getQuickDates = () => {
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                dates.push({
                    date: date.toISOString().split('T')[0],
                    label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                });
            }
            return dates;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const finalDate = appointmentData.customDate || appointmentData.date;
            const finalTime = appointmentData.useCustomTime ? appointmentData.customTime : appointmentData.time;

            if (!finalDate || !finalTime) {
                toast.error('Please select both date and time');
                return;
            }

            try {
                const response = await api.post('/appointments', {
                    doctor: selectedDoctor._id,
                    appointmentDate: finalDate,
                    appointmentTime: finalTime,
                    consultationType: appointmentData.type,
                    reason: appointmentData.reason,
                    duration: appointmentData.duration,
                });

                if (response.data.success) {
                    toast.success('Appointment booked successfully!');
                    setShowBookingModal(false);
                } else {
                    toast.success('Booking request sent! (Demo mode)');
                    setShowBookingModal(false);
                }
            } catch (error) {
                toast.success('Booking request sent! (Demo mode)');
                setShowBookingModal(false);
            }
        };

        const quickDates = getQuickDates();

        return (
            <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                <div className="modal-content booking-modal-large" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>📅 Customize Your Appointment</h2>
                        <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
                    </div>

                    <div className="doctor-info-modal">
                        <h3>{selectedDoctor?.user?.name}</h3>
                        <p>{selectedDoctor?.specialization?.charAt(0).toUpperCase() + selectedDoctor?.specialization?.slice(1)} • {selectedDoctor?.clinicName}</p>
                        <p className="fee">Consultation Fee: ₹{selectedDoctor?.consultationFee}</p>
                        <p className="availability-info">
                            <FiClock /> {selectedDoctor?.availability}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form-custom">
                        {/* Quick Date Selection */}
                        <div className="form-section">
                            <label className="section-label">📆 Select Date</label>
                            <div className="quick-dates-grid">
                                {quickDates.map((d, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`quick-date-card ${appointmentData.date === d.date ? 'selected' : ''}`}
                                        onClick={() => setAppointmentData({ ...appointmentData, date: d.date, customDate: '' })}
                                    >
                                        <div className="date-label">{d.label}</div>
                                        <div className="date-value">{new Date(d.date).getDate()}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="or-divider">OR</div>

                            <input
                                type="date"
                                className="custom-date-input"
                                value={appointmentData.customDate}
                                onChange={(e) => setAppointmentData({ ...appointmentData, customDate: e.target.value, date: '' })}
                                min={new Date().toISOString().split('T')[0]}
                                max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                placeholder="Choose any date within 3 months"
                            />
                        </div>

                        {/* Time Selection */}
                        <div className="form-section">
                            <label className="section-label">
                                ⏰ Select Time
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={appointmentData.useCustomTime}
                                        onChange={(e) => setAppointmentData({ ...appointmentData, useCustomTime: e.target.checked })}
                                    />
                                    <span className="slider"></span>
                                    <span className="toggle-label">Custom Time</span>
                                </label>
                            </label>

                            {!appointmentData.useCustomTime ? (
                                <div className="time-slots-selection">
                                    {selectedDoctor?.availableSlots?.map((slot, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`time-slot-card ${appointmentData.time === slot ? 'selected' : ''}`}
                                            onClick={() => setAppointmentData({ ...appointmentData, time: slot, customTime: '' })}
                                        >
                                            <FiClock />
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="time"
                                    className="custom-time-input"
                                    value={appointmentData.customTime}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, customTime: e.target.value, time: '' })}
                                    min="06:00"
                                    max="22:00"
                                />
                            )}
                        </div>

                        {/* Duration & Type */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>⏱️ Duration</label>
                                <select
                                    value={appointmentData.duration}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, duration: e.target.value })}
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">1 hour</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>🏥 Consultation Type</label>
                                <select
                                    value={appointmentData.type}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, type: e.target.value })}
                                >
                                    <option value="clinic">Clinic Visit</option>
                                    <option value="video">Video Call</option>
                                    <option value="home">Home Visit (+₹200)</option>
                                </select>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="form-group">
                            <label>📝 Reason for Visit</label>
                            <textarea
                                value={appointmentData.reason}
                                onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
                                placeholder="Describe your health concern..."
                                rows="3"
                                required
                            />
                        </div>

                        {/* Summary */}
                        <div className="booking-summary-card">
                            <h4>📋 Booking Summary</h4>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="label">Date:</span>
                                    <span className="value">
                                        {appointmentData.customDate || appointmentData.date
                                            ? new Date(appointmentData.customDate || appointmentData.date).toLocaleDateString('en-IN', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : 'Not selected'}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Time:</span>
                                    <span className="value">{appointmentData.customTime || appointmentData.time || 'Not selected'}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Duration:</span>
                                    <span className="value">{appointmentData.duration} minutes</span>
                                </div>
                                <div className="summary-item total">
                                    <span className="label">Total Fee:</span>
                                    <span className="value">₹{selectedDoctor?.consultationFee}{appointmentData.type === 'home' ? ' + ₹200' : ''}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setShowBookingModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg">
                                <FiCalendar /> Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="doctors-page">
            <div className="container">
                <div className="page-header">
                    <h1>Find Local Doctors</h1>
                    <p>Book appointments with verified doctors - Customize your date & time</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by doctor name, specialization, or clinic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="category-filter">
                    <h3>Specializations</h3>
                    <div className="category-grid">
                        {specializations.map(spec => (
                            <button
                                key={spec.id}
                                className={`category-btn ${selectedSpecialization === spec.id ? 'active' : ''}`}
                                onClick={() => setSelectedSpecialization(spec.id)}
                            >
                                <span className="category-icon">{spec.icon}</span>
                                <span className="category-name">{spec.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="doctors-section">
                    <div className="section-header">
                        <h2>
                            {selectedSpecialization === 'all'
                                ? 'All Doctors'
                                : specializations.find(s => s.id === selectedSpecialization)?.name}
                        </h2>
                        <span className="count">{filteredDoctors.length} doctors</span>
                    </div>

                    {loading ? (
                        <div className="loading">Loading doctors...</div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="no-results card">
                            <p>No doctors found.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedSpecialization('all')}>
                                View All Doctors
                            </button>
                        </div>
                    ) : (
                        <div className="doctors-grid">
                            {filteredDoctors.map(doctor => (
                                <div key={doctor._id} className="doctor-card card">
                                    <div className="doctor-header">
                                        <div className="doctor-avatar">
                                            {doctor.user?.name?.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="doctor-info">
                                            <h3>{doctor.user?.name}</h3>
                                            <p className="specialization">
                                                {specializations.find(s => s.id === doctor.specialization)?.icon}
                                                {' '}
                                                {doctor.specialization?.charAt(0).toUpperCase() + doctor.specialization?.slice(1)}
                                            </p>
                                            <p className="qualification">{doctor.qualification}</p>
                                        </div>
                                        {doctor.isEmergency && (
                                            <span className="emergency-badge">🚨 24/7</span>
                                        )}
                                    </div>

                                    <div className="doctor-details">
                                        <div className="detail-row">
                                            <FiMapPin />
                                            <span>{doctor.clinicName}, {doctor.user?.location?.city}</span>
                                        </div>
                                        <div className="detail-row">
                                            <FiStar />
                                            <span>
                                                {doctor.user?.rating?.toFixed(1)} ({doctor.user?.reviewCount} reviews)
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <FiClock />
                                            <span className="availability">{doctor.availability}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="experience-badge">
                                                {doctor.experience} years experience
                                            </span>
                                        </div>
                                    </div>

                                    <div className="time-slots">
                                        <h4>Available Today</h4>
                                        <div className="slots-grid">
                                            {doctor.availableSlots?.slice(0, 4).map((slot, index) => (
                                                <span key={index} className="time-slot">{slot}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="doctor-footer">
                                        <div className="price">
                                            <span className="amount">₹{doctor.consultationFee}</span>
                                            <span className="period">/consultation</span>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleBookAppointment(doctor)}
                                        >
                                            <FiCalendar /> Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showBookingModal && <BookingModal />}
        </div>
    );
};

export default Doctors;
