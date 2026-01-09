import { useState, useEffect } from 'react';
import { FiGift, FiCopy, FiShare2, FiTrendingUp, FiAward, FiUsers, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Referrals = () => {
    const { user } = useAuth();
    const [referralCode, setReferralCode] = useState('');
    const [inputReferralCode, setInputReferralCode] = useState('');
    const [coins, setCoins] = useState(0);
    const [silverCoins, setSilverCoins] = useState(0);
    const [goldCoins, setGoldCoins] = useState(0);
    const [referrals, setReferrals] = useState(0);
    const [rank, setRank] = useState(0);
    const [hasUsedReferral, setHasUsedReferral] = useState(false);
    const [activeChallenges, setActiveChallenges] = useState([
        { id: 1, name: 'Spin the Wheel', reward: 5, icon: '🎡', played: false },
        { id: 2, name: 'Lucky Number', reward: 3, icon: '🎲', played: false },
        { id: 3, name: 'Scratch Card', reward: 10, icon: '🎫', played: false },
        { id: 4, name: 'Quiz Challenge', reward: 7, icon: '🧠', played: false },
    ]);

    // Generate unique referral code based on user
    useEffect(() => {
        if (user) {
            // Create unique code from user ID or email
            const uniqueCode = 'JANA' + user._id?.substring(user._id.length - 6).toUpperCase() ||
                'JANA' + Math.random().toString(36).substring(2, 8).toUpperCase();
            setReferralCode(uniqueCode);
        } else {
            // For non-logged in users, generate temporary code
            setReferralCode('JANA' + Math.random().toString(36).substring(2, 8).toUpperCase());
        }
    }, [user]);

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

    const applyReferralCode = () => {
        if (!inputReferralCode.trim()) {
            toast.error('Please enter a referral code');
            return;
        }

        if (inputReferralCode.toUpperCase() === referralCode) {
            toast.error('You cannot use your own referral code!');
            return;
        }

        if (hasUsedReferral) {
            toast.warning('You have already used a referral code!');
            return;
        }

        // Validate referral code format
        if (!inputReferralCode.toUpperCase().startsWith('JANA')) {
            toast.error('Invalid referral code format');
            return;
        }

        // TODO: Send to backend API to validate and apply referral
        // For now, simulate success
        setHasUsedReferral(true);
        setCoins(coins + 10); // Bonus coins for using referral
        toast.success(`Referral code applied! You earned 10 bonus coins! 🎉`);
        setInputReferralCode('');
    };

    const playChallenge = (challengeId) => {
        const challenge = activeChallenges.find(c => c.id === challengeId);
        if (challenge.played) {
            toast.warning('You have already played this challenge today!');
            return;
        }

        // Simulate game play - random win/lose
        const won = Math.random() > 0.3; // 70% win rate

        if (won) {
            const silverWon = challenge.reward;
            setSilverCoins(silverCoins + silverWon);
            toast.success(`🎉 You won ${silverWon} Silver Coins!`);
        } else {
            toast.info('Better luck next time! Try again tomorrow.');
        }

        // Mark challenge as played
        setActiveChallenges(activeChallenges.map(c =>
            c.id === challengeId ? { ...c, played: true } : c
        ));
    };

    const exchangeSilverToGold = () => {
        if (silverCoins < 15) {
            toast.error('You need at least 15 Silver Coins to exchange for 1 Gold Coin!');
            return;
        }

        const goldToAdd = Math.floor(silverCoins / 15);
        const silverRemaining = silverCoins % 15;

        setSilverCoins(silverRemaining);
        setGoldCoins(goldCoins + goldToAdd);
        toast.success(`✨ Exchanged ${goldToAdd} Gold Coin${goldToAdd > 1 ? 's' : ''}! You have ${silverRemaining} Silver Coins left.`);
    };

    const convertGoldToPoints = () => {
        if (goldCoins < 1) {
            toast.error('You need at least 1 Gold Coin to convert to points!');
            return;
        }

        const pointsToAdd = goldCoins * 100; // 1 Gold Coin = 100 points
        setCoins(coins + pointsToAdd);
        setGoldCoins(0);
        toast.success(`🎊 Converted ${goldCoins} Gold Coin${goldCoins > 1 ? 's' : ''} to ${pointsToAdd} Points!`);
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <FiAward size={40} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{coins}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Total Points</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥈</div>
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{silverCoins}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Silver Coins</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>15 = 1 Gold</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥇</div>
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{goldCoins}</h3>
                    <p style={{ color: '#666', margin: 0 }}>Gold Coins</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>1 = 100 Points</p>
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

            {/* Coin Exchange Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h2 style={{ marginBottom: '1rem', color: 'white' }}>💱 Coin Exchange</h2>
                <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Exchange your coins to unlock rewards!</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={exchangeSilverToGold}
                        disabled={silverCoins < 15}
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#667eea',
                            fontWeight: 'bold',
                            padding: '1rem 2rem',
                            opacity: silverCoins < 15 ? 0.5 : 1,
                            cursor: silverCoins < 15 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🥈 → 🥇 Exchange Silver to Gold
                    </button>
                    <button
                        onClick={convertGoldToPoints}
                        disabled={goldCoins < 1}
                        className="btn"
                        style={{
                            background: '#ffd700',
                            color: '#333',
                            fontWeight: 'bold',
                            padding: '1rem 2rem',
                            opacity: goldCoins < 1 ? 0.5 : 1,
                            cursor: goldCoins < 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🥇 → 💎 Convert Gold to Points
                    </button>
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

            {/* Enter Referral Code Section */}
            {!hasUsedReferral && (
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'white' }}>Have a Referral Code?</h2>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Enter a friend's referral code to earn 10 bonus coins!</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={inputReferralCode}
                            onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                            placeholder="Enter code (e.g., JANAABC123)"
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '2px solid white',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}
                        />
                        <button
                            onClick={applyReferralCode}
                            className="btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'white',
                                color: '#f5576c',
                                fontWeight: 'bold',
                                padding: '1rem 2rem'
                            }}
                        >
                            <FiCheck /> Apply Code
                        </button>
                    </div>
                </div>
            )}

            {hasUsedReferral && (
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: '#d4edda', border: '2px solid #28a745' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#155724' }}>
                        <FiCheck size={30} style={{ color: '#28a745' }} />
                        <div>
                            <h3 style={{ margin: 0, color: '#155724' }}>Referral Code Applied!</h3>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#155724' }}>You've earned your bonus coins. Start referring friends to earn more!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Challenges / Games Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>🎮 Daily Challenges</h2>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Play games and win Silver Coins! Resets every 24 hours.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {activeChallenges.map(challenge => (
                        <div
                            key={challenge.id}
                            className="card"
                            style={{
                                padding: '1.5rem',
                                textAlign: 'center',
                                background: challenge.played ? '#f5f5f5' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: challenge.played ? '#666' : 'white',
                                border: challenge.played ? '2px dashed #ccc' : 'none',
                                cursor: challenge.played ? 'not-allowed' : 'pointer',
                                transition: 'transform 0.2s',
                                ':hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{challenge.icon}</div>
                            <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{challenge.name}</h3>
                            <p style={{ margin: '0.5rem 0', opacity: 0.9 }}>
                                Win up to {challenge.reward} 🥈
                            </p>
                            <button
                                onClick={() => playChallenge(challenge.id)}
                                disabled={challenge.played}
                                className="btn"
                                style={{
                                    marginTop: '1rem',
                                    background: challenge.played ? '#ccc' : 'white',
                                    color: challenge.played ? '#666' : '#667eea',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    cursor: challenge.played ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {challenge.played ? '✓ Played' : 'Play Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Activities - Social Media (Placeholder) */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <h2 style={{ marginBottom: '0.5rem', color: 'white' }}>📱 Daily Social Media Activities</h2>
                <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Complete daily tasks on social media to earn Gold Coins!</p>

                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '15px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '2px dashed rgba(255,255,255,0.5)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔗</div>
                    <h3 style={{ margin: '1rem 0', color: 'white' }}>Coming Soon!</h3>
                    <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
                        Link your social media accounts and complete daily tasks:
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '2rem', marginTop: '1.5rem' }}>
                        <span title="YouTube">📺</span>
                        <span title="Instagram">📷</span>
                        <span title="Facebook">👥</span>
                        <span title="Twitter">🐦</span>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                        • Like posts → Earn 1 🥇<br />
                        • Follow/Subscribe → Earn 3 🥇<br />
                        • Share content → Earn 2 🥇
                    </p>
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
