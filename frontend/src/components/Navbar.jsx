import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiBriefcase, FiUsers, FiHeart, FiGift } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();

    const t = (key) => getTranslation(language, key);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">🌱</span>
                        <span className="logo-text">JanaSeva</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links desktop-only">
                        <Link to="/" className="nav-link">
                            <FiHome /> {t('nav.home')}
                        </Link>
                        <Link to="/referrals" className="nav-link">
                            <FiGift /> Referrals
                        </Link>
                        <Link to="/workers" className="nav-link">
                            <FiUsers /> {t('nav.workers')}
                        </Link>
                        <Link to="/doctors" className="nav-link">
                            <FiHeart /> {t('nav.doctors')}
                        </Link>
                        <Link to="/farmers" className="nav-link">
                            🌾 {t('nav.farmers')}
                        </Link>
                        <Link to="/jobs" className="nav-link">
                            <FiBriefcase /> {t('nav.jobs')}
                        </Link>
                        <Link to="/community" className="nav-link">
                            🤝 {t('nav.community')}
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="navbar-actions desktop-only">
                        <LanguageSwitcher />
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <Link to="/profile" className="btn btn-outline btn-sm">
                                    <FiUser /> {t('nav.profile')}
                                </Link>
                                <Link to="/dashboard" className="btn btn-outline btn-sm">
                                    {t('nav.dashboard')}
                                </Link>
                                <button onClick={handleLogout} className="btn btn-primary btn-sm">
                                    <FiLogOut /> {t('nav.logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-outline btn-sm">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="mobile-menu">
                        <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FiHome /> {t('nav.home')}
                        </Link>
                        <Link to="/referrals" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FiGift /> Referrals
                        </Link>
                        <Link to="/workers" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FiUsers /> {t('nav.workers')}
                        </Link>
                        <Link to="/doctors" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FiHeart /> {t('nav.doctors')}
                        </Link>
                        <Link to="/farmers" className="mobile-link" onClick={() => setIsOpen(false)}>
                            🌾 {t('nav.farmers')}
                        </Link>
                        <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>
                            <FiBriefcase /> {t('nav.jobs')}
                        </Link>
                        <Link to="/community" className="mobile-link" onClick={() => setIsOpen(false)}>
                            🤝 {t('nav.community')}
                        </Link>

                        <div className="mobile-divider"></div>

                        <div className="mobile-language-switcher">
                            <LanguageSwitcher />
                        </div>

                        <div className="mobile-divider"></div>

                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    <FiUser /> {t('nav.profile')}
                                </Link>
                                <Link to="/dashboard" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    {t('nav.dashboard')}
                                </Link>
                                <button onClick={handleLogout} className="mobile-link logout-btn">
                                    <FiLogOut /> {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
