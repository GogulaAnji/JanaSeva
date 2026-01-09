import { Link } from 'react-router-dom';
import { FiUsers, FiHeart, FiBriefcase, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: <FiUsers size={40} />,
            title: 'Local Workers',
            description: 'Find skilled workers from electricians to plumbers, all verified and rated by the community.',
            link: '/workers',
            color: 'var(--primary-green)',
        },
        {
            icon: <FiHeart size={40} />,
            title: 'Healthcare',
            description: 'Connect with doctors, book appointments, and access healthcare services from village to city.',
            link: '/doctors',
            color: 'var(--error)',
        },
        {
            icon: '🌾',
            title: 'Agriculture',
            description: 'Direct connection between farmers and buyers. Fresh produce, fair prices, no middlemen.',
            link: '/farmers',
            color: 'var(--accent-orange)',
        },
        {
            icon: <FiBriefcase size={40} />,
            title: 'Employment',
            description: 'Browse jobs, post opportunities, and connect talent with employers across all sectors.',
            link: '/jobs',
            color: 'var(--secondary-blue)',
        },
        {
            icon: '🤝',
            title: 'Community',
            description: 'Blood donation, emergency help, lost & found, and community events all in one place.',
            link: '/community',
            color: 'var(--accent-purple)',
        },
        {
            icon: <FiZap size={40} />,
            title: 'AI Powered',
            description: 'Smart job matching, resume analysis, health guidance, and scheme explanations in simple language.',
            link: '/dashboard',
            color: 'var(--warning)',
        },
    ];

    const stats = [
        { number: '10,000+', label: 'Active Users' },
        { number: '5,000+', label: 'Jobs Posted' },
        { number: '2,000+', label: 'Service Providers' },
        { number: '500+', label: 'Villages Connected' },
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title slide-up">
                                Empowering Communities
                                <span className="gradient-text"> From Village to City</span>
                            </h1>
                            <p className="hero-description slide-up">
                                JanaSeva is India's first comprehensive platform connecting employment, healthcare, agriculture, and community services. Built for the people, by the people.
                            </p>
                            <div className="hero-buttons slide-up">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/about" className="btn btn-outline btn-lg">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="hero-card card">
                                <div className="hero-card-icon">🌱</div>
                                <h3>Join 10,000+ Users</h3>
                                <p>Making a difference every day</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">All-in-One Platform</h2>
                        <p className="section-description">
                            Everything you need to connect, grow, and thrive in one powerful platform
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <Link
                                to={feature.link}
                                key={index}
                                className="feature-card card"
                                style={{ '--feature-color': feature.color }}
                            >
                                <div className="feature-icon" style={{ color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                                <span className="feature-link">Explore →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Why Choose JanaSeva?</h2>
                        <p className="section-description">
                            Built with the needs of rural and urban India in mind
                        </p>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-card card">
                            <FiShield size={48} className="benefit-icon" />
                            <h3>Verified & Trusted</h3>
                            <p>All users are verified. Reviews and ratings ensure quality and trust.</p>
                        </div>
                        <div className="benefit-card card">
                            <FiTrendingUp size={48} className="benefit-icon" />
                            <h3>Growth Focused</h3>
                            <p>AI-powered recommendations help you grow your skills and opportunities.</p>
                        </div>
                        <div className="benefit-card card">
                            <FiZap size={48} className="benefit-icon" />
                            <h3>Fast & Easy</h3>
                            <p>Simple interface in multiple languages. No technical knowledge needed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Make a Difference?</h2>
                        <p className="cta-description">
                            Join thousands of Indians building a better future together
                        </p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-description">
                            Quick answers to common questions about JanaSeva
                        </p>
                    </div>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <details>
                                <summary>What is JanaSeva?</summary>
                                <p>JanaSeva is a comprehensive platform connecting farmers, workers, doctors, and communities across India. We help farmers sell produce directly, workers find jobs, and people access essential services without middlemen.</p>
                            </details>
                        </div>
                        <div className="faq-item">
                            <details>
                                <summary>Is JanaSeva free to use?</summary>
                                <p>Yes! JanaSeva is completely free for all users. No fees, no commissions. Farmers keep 100% of their earnings, and buyers pay only the agreed price.</p>
                            </details>
                        </div>
                        <div className="faq-item">
                            <details>
                                <summary>How do I post products or services?</summary>
                                <p>After logging in, click the "Post Product" or "Post Service" button. Upload photos, add details and pricing, then publish. Your listing goes live immediately!</p>
                            </details>
                        </div>
                        <div className="faq-item">
                            <details>
                                <summary>How does pricing work for workers?</summary>
                                <p>Workers can set flexible pricing: hourly rates (₹200/hr), daily rates (₹500/day), per-job rates, or custom negotiable pricing. You can set multiple options!</p>
                            </details>
                        </div>
                        <div className="faq-item">
                            <details>
                                <summary>Can I negotiate prices?</summary>
                                <p>Absolutely! Use the chat feature to discuss prices, quantities, and terms directly with farmers and workers. Many are open to negotiation, especially for bulk orders.</p>
                            </details>
                        </div>
                        <div className="faq-item">
                            <details>
                                <summary>How do buyers contact me?</summary>
                                <p>When someone is interested, you'll receive a notification. They can call you directly using the call button or start a chat to discuss details and negotiate.</p>
                            </details>
                        </div>
                    </div>
                    <div className="faq-footer">
                        <Link to="/faq" className="btn btn-outline">
                            View All FAQs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
