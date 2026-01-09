import { useState } from 'react';
import { FiGift, FiCopy, FiShare2, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Referrals = () => {
    const [referralCode] = useState('JANA' + Math.random().toString(36).substring(2, 8).toUpperCase());
    const [coins, setCoins] = useState(0);
    const [referrals, setReferrals] = useState(0);
    const [rank, setRank] = useState(0);

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        toast.success('Referral code copied to clipboard!');
    };

    const shareReferral = () => {
        const shareText = `Join JanaSeva and use my referral code: ${referralCode} to earn coins!`;
        if (navigator.share) {
            navigator.share({
                title: 'Join JanaSeva',
                text: shareText,
                url: window.location.origin
            });
        } else {
            navigator.clipboard.writeText(shareText);
            toast.success('Share text copied to clipboard!');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0', minHeight: '80vh' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                padding: '3rem 2rem',
                color: 'white',
                textAlign: 'center',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <FiGift size={40} /> Earn Coins & Win Rewards!
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        Refer friends, complete tasks, and win amazing prizes
                    </p>
                </div>
                {/* Floating coins animation */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '3rem', opacity: 0.3 }}>
                    💰
                </div>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '2rem', opacity: 0.3 }}>
                    🪙
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <FiAward size={40} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{coins}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Total Coins</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <FiUsers size={40} style={{ color: '#764ba2', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{referrals}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Referrals</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <FiTrendingUp size={40} style={{ color: '#f093fb', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>#{rank || '---'}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Your Rank</p>
                </div>
            </div>

            {/* Referral Code Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your Referral Code</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '10px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        letterSpacing: '2px',
                        color: '#667eea'
                    }}>
                        {referralCode}
                    </div>
                    <button onClick={copyReferralCode} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiCopy /> Copy
                    </button>
                    <button onClick={shareReferral} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiShare2 /> Share
                    </button>
                </div>
            </div>

            {/* How to Earn Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>How to Earn Coins</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>10 Coins</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Per Referral</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👍</div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>1 Coin</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Per Like</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>➕</div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>3 Coins</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Follow/Subscribe</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📤</div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>2 Coins</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Per Share</p>
                    </div>
                </div>
            </div>

            {/* Rules Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Rules & Guidelines</h2>
                <ul style={{ lineHeight: '2', color: '#555' }}>
                    <li>✅ Must be a registered user to participate</li>
                    <li>✅ Valid task completion required</li>
                    <li>✅ No fake accounts or fraudulent activities</li>
                    <li>✅ Coins don't expire during the 6-month period</li>
                    <li>✅ Coin value will be revealed after 6 months</li>
                    <li>✅ Top 1000 users will be ranked on the leaderboard</li>
                </ul>
            </div>

            {/* FAQ Section */}
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <details style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            What are coins and how do they work?
                        </summary>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            Coins are points you earn by referring friends and completing social media tasks. The monetary value of coins will be revealed after 6 months.
                        </p>
                    </details>
                    <details style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            When will I know the value of my coins?
                        </summary>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            After 6 months of collecting coins, the value will be revealed in the 7th month along with reward distribution.
                        </p>
                    </details>
                    <details style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            How do I see my rank on the leaderboard?
                        </summary>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            Your rank is based on total coins earned. The global leaderboard will show the top 1000 users.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Referrals;
