import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container" style={{ padding: '3rem 0', minHeight: '70vh' }}>
            <h1>Welcome, {user?.name}!</h1>
            <p>Role: <strong>{user?.role}</strong></p>
            <div className="card mt-3">
                <h2>Dashboard</h2>
                <p>Your personalized dashboard based on your role will appear here.</p>
                <p>This includes profile management, job applications, appointments, and more.</p>
            </div>
        </div>
    );
};

export default Dashboard;
