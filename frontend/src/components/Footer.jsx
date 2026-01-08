import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="footer-title">
                            <span className="logo-icon">🌱</span> JanaSeva
                        </h3>
                        <p className="footer-text">
                            Connecting communities from village to city. Empowering employment, healthcare, agriculture, and social services.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><FiFacebook /></a>
                            <a href="#" className="social-link"><FiTwitter /></a>
                            <a href="#" className="social-link"><FiInstagram /></a>
                            <a href="#" className="social-link"><FiLinkedin /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/workers">Find Workers</Link></li>
                            <li><Link to="/doctors">Find Doctors</Link></li>
                            <li><Link to="/farmers">Farmers Market</Link></li>
                            <li><Link to="/jobs">Browse Jobs</Link></li>
                            <li><Link to="/community">Community Services</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Services</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="contact-info">
                            <li>
                                <FiMail />
                                <span>support@janaseva.com</span>
                            </li>
                            <li>
                                <FiPhone />
                                <span>+91 1800-123-4567</span>
                            </li>
                            <li>
                                <FiMapPin />
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} JanaSeva. All rights reserved.</p>
                    <p>Made with ❤️ for the people of India</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
